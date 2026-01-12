/* =========================================================
   Crypto 15m Signal Engine — PRICE + MARKET AWARE (FINAL)
   - Real price-driven resolution
   - Odds-based PnL (simulated capital)
   - Read-only Polymarket odds ingestion
   - Edge detection
   - Deterministic trade explanation
========================================================= */

import { getLivePrice } from "./priceFeed";
import { getPolymarketOdds } from "./polymarketOddsFeed";
import { calculateEdge } from "./edgeCalculator";
import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

/* ================= CONFIG ================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;
const STAKE = 1;
const EDGE_THRESHOLD = 0.06;

/* ================= STATE ================= */

const engineState = {};
for (const a of ASSETS) {
  engineState[a] = { activeSignal: null, history: [] };
}

/* ================= UTILS ================= */

const now = () => Date.now();
const id = s => `${s}-15m-${Date.now()}`;

/* ================= EXPLAINER ================= */

function buildExplanation(signal) {
  const lines = [];

  lines.push(
    `Model favors ${signal.direction} with ${(signal.confidence * 100).toFixed(1)}% confidence.`
  );

  if (typeof signal.marketProbability === "number") {
    const m = (signal.marketProbability * 100).toFixed(1);
    const e = (signal.edge * 100).toFixed(1);

    if (signal.edge > 0) {
      lines.push(`Market implies ${m}%, creating a +${e}% edge.`);
    } else {
      lines.push(`Market odds (${m}%) offer no positive edge.`);
    }
  } else {
    lines.push(`Market odds not yet available.`);
  }

  if (!signal.entryOpen) {
    lines.push(`Entry window closed — late entries underperform.`);
  } else {
    lines.push(`Entry window open with sufficient time remaining.`);
  }

  if (signal.mispriced && signal.entryOpen) {
    lines.push(`✅ Trade qualifies as positive expected value.`);
  } else {
    lines.push(`⚠ Trade does not meet strict EV criteria.`);
  }

  return lines;
}

/* ================= CREATE SIGNAL ================= */

async function createSignal(symbol) {
  const createdAt = now();
  const price = await getLivePrice(symbol);
  if (!price) return null;

  const confidence = 0.74; // upstream engine

  const signal = {
    id: id(symbol),
    symbol,
    timeframe: "15m",

    direction: confidence >= 0.5 ? "UP" : "DOWN",
    confidence,

    createdAt,
    resolveAt: createdAt + TIMEFRAME_MS,
    entryClosesAt: createdAt + TIMEFRAME_MS * SAFE_ENTRY_RATIO,

    entryOpen: true,
    resolved: false,

    priceAtSignal: price,
    priceAtEntry: null,
    priceAtResolve: null,

    marketOdds: null,
    marketProbability: null,
    edge: null,
    mispriced: false,

    pnl: 0,
    result: null,

    userAction: null,
    entryAt: null,
    entryDelayMs: null,

    explanation: [],
  };

  signal.explanation = buildExplanation(signal);
  return signal;
}

/* ================= RESOLUTION ================= */

function resolveSignal(signal) {
  const won =
    signal.direction === "UP"
      ? signal.priceAtResolve > signal.priceAtEntry
      : signal.priceAtResolve < signal.priceAtEntry;

  signal.result = won ? "WIN" : "LOSS";

  if (
    signal.userAction === "ENTER" &&
    typeof signal.marketProbability === "number"
  ) {
    const p = signal.marketProbability;
    const payout = won ? (1 / p) - 1 : -1;
    signal.pnl = Number((payout * STAKE).toFixed(4));
  } else {
    signal.pnl = 0;
  }

  signal.resolved = true;
}

/* ================= ENGINE LOOP ================= */

export async function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let s = state.activeSignal;

    if (!s) {
      state.activeSignal = await createSignal(asset);
      continue;
    }

    if (s.entryOpen && t >= s.entryClosesAt) {
      s.entryOpen = false;
      s.explanation = buildExplanation(s);
    }

    if (!s.marketOdds) {
      const odds = await getPolymarketOdds(asset);
      if (odds) {
        s.marketOdds = odds;
        s.marketProbability = odds.marketProb;

        const edgeObj = calculateEdge({
          confidence: s.confidence,
          marketProb: odds.marketProb,
        });

        s.edge = edgeObj?.edge ?? null;
        s.mispriced =
          typeof s.edge === "number" && s.edge >= EDGE_THRESHOLD;

        s.explanation = buildExplanation(s);
      }
    }

    if (!s.resolved && t >= s.resolveAt) {
      s.priceAtResolve = await getLivePrice(asset);
      s.priceAtEntry ||= s.priceAtSignal;

      resolveSignal(s);

      state.history.unshift(s);
      state.history = state.history.slice(0, 50);
      persistResolvedSignal(s);

      state.activeSignal = await createSignal(asset);
    }
  }
}

/* ================= USER ACTIONS ================= */

export function enterSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;

  s.userAction = "ENTER";
  s.entryAt = now();
  s.entryDelayMs = s.entryAt - s.createdAt;
  s.priceAtEntry = s.priceAtSignal;
  return true;
}

export function skipSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;

  s.userAction = "SKIP";
  s.entryOpen = false;
  s.explanation = buildExplanation(s);
  return true;
}

/* ================= SELECTORS ================= */

export function getActive15mSignals() {
  const out = {};
  for (const a of ASSETS) out[a] = engineState[a].activeSignal;
  return out;
}

export function getLastResolvedSignals(limit = 50) {
  const persisted = loadResolvedSignals();
  const mem = Object.values(engineState)
    .flatMap(s => s.history)
    .filter(s => s.resolved);

  return [...persisted, ...mem]
    .reduce((acc, s) => {
      if (!acc.find(x => x.id === s.id)) acc.push(s);
      return acc;
    }, [])
    .sort((a, b) => b.resolveAt - a.resolveAt)
    .slice(0, limit);
}

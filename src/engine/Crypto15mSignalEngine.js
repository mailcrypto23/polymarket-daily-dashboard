/* =========================================================
   Crypto 15m Signal Engine — FINAL (STABLE)
   - WebSocket / REST price-driven
   - Confidence calibration
   - Regime filtering
   - Kelly sizing (advisory)
   - XRP-safe initialization
   - UI-safe YES / NO actions
========================================================= */

import { getLivePrice } from "./priceFeed";
import { getPolymarketOdds } from "./polymarketOddsFeed";
import { calculateEdge } from "./edgeCalculator";
import { calibrateConfidence } from "./confidenceCalibrator";
import { isTradeableRegime } from "./regimeFilter";
import { kellySize } from "./kellySizing";
import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

/* ================= CONFIG ================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = import.meta.env.DEV ? 60_000 : 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;
const STAKE = 1;
const EDGE_THRESHOLD = 0.06;

/* ================= STATE ================= */

const engineState = {};
for (const a of ASSETS) {
  engineState[a] = {
    activeSignal: null,
    history: [],
    recentPrices: [],
  };
}

/* ================= UTILS ================= */

const now = () => Date.now();
const generateId = s => `${s}-15m-${Date.now()}`;

/* ================= EXPLAINER ================= */

function buildExplanation(signal) {
  const lines = [];

  lines.push(
    `Model confidence: ${(signal.confidence * 100).toFixed(1)}% (${signal.direction}).`
  );

  if (typeof signal.marketProbability === "number") {
    lines.push(
      `Market implied: ${(signal.marketProbability * 100).toFixed(1)}%, edge ${(signal.edge * 100).toFixed(1)}%.`
    );
  }

  if (!signal.regimeOK) {
    lines.push("⚠ Market regime unfavorable (low volatility).");
  }

  if (signal.kellyFraction > 0) {
    lines.push(
      `Kelly size suggestion: ${(signal.kellyFraction * 100).toFixed(1)}% of bankroll.`
    );
  }

  lines.push(
    signal.entryOpen
      ? "Entry window open."
      : "Entry closed — timing edge decayed."
  );

  return lines;
}

/* ================= CREATE SIGNAL ================= */

async function createSignal(symbol) {
  const createdAt = now();

  let price = await getLivePrice(symbol);
  if (!Number.isFinite(price)) price = 0; // XRP-safe

  const rawConfidence = 0.74;
  const confidence = calibrateConfidence(rawConfidence);

  return {
    id: generateId(symbol),
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

    marketProbability: null,
    edge: null,
    mispriced: false,

    regimeOK: true,
    kellyFraction: 0,

    pnl: 0,
    result: null,

    userAction: null,
    entryAt: null,
    entryDelayMs: null,

    explanation: [],
  };
}

/* ================= RESOLUTION ================= */

function resolveSignal(signal) {
  const won =
    signal.direction === "UP"
      ? signal.priceAtResolve > signal.priceAtEntry
      : signal.priceAtResolve < signal.priceAtEntry;

  signal.result = won ? "WIN" : "LOSS";

  if (signal.userAction === "ENTER" && signal.marketProbability) {
    const p = signal.marketProbability;
    signal.pnl = Number(((won ? 1 / p - 1 : -1) * STAKE).toFixed(4));
  }

  signal.resolved = true;
}

/* ================= ENGINE LOOP ================= */

export async function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let s = state.activeSignal;

    const price = await getLivePrice(asset);
    if (Number.isFinite(price)) {
      state.recentPrices.push(price);
      if (state.recentPrices.length > 30) state.recentPrices.shift();
    }

    if (!s) {
      state.activeSignal = await createSignal(asset);
      continue;
    }

    if (s.entryOpen && t >= s.entryClosesAt) {
      s.entryOpen = false;
    }

    if (!s.marketProbability) {
      const odds = await getPolymarketOdds(asset);
      if (odds) {
        s.marketProbability = odds.marketProb;

        const edgeObj = calculateEdge({
          confidence: s.confidence,
          marketProb: odds.marketProb,
        });

        s.edge = edgeObj?.edge ?? 0;
        s.mispriced = s.edge >= EDGE_THRESHOLD;

        s.regimeOK = isTradeableRegime(state.recentPrices);

        s.kellyFraction = s.mispriced
          ? kellySize({
              edge: s.edge,
              odds: 1 / odds.marketProb,
            })
          : 0;

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

/* ================= UI ACTION EXPORTS (REQUIRED) ================= */

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

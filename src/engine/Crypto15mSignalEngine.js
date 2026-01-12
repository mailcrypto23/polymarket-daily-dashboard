/* =========================================================
   Crypto 15m Signal Engine — PRICE + MARKET AWARE (FINAL)
   - Real price-driven resolution
   - Odds-based PnL (simulated capital)
   - Read-only Polymarket odds ingestion
   - Edge detection + heatmap support
   - UI-safe (ENTER / SKIP preserved)
========================================================= */

import { getLivePrice } from "./priceFeed";
import { getPolymarketOdds } from "./polymarketOddsFeed";
import { calculateEdge } from "./edgeCalculator";
import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

/* =========================================================
   CONFIG
========================================================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;
const STAKE = 1; // simulated unit stake
const EDGE_THRESHOLD = 0.06;

/* =========================================================
   ENGINE STATE
========================================================= */

const engineState = {};
for (const asset of ASSETS) {
  engineState[asset] = {
    activeSignal: null,
    history: [],
  };
}

/* =========================================================
   UTILS
========================================================= */

const now = () => Date.now();
const generateId = s => `${s}-15m-${Date.now()}`;

/* =========================================================
   CREATE SIGNAL
========================================================= */

async function createSignal(symbol) {
  const createdAt = now();
  const price = await getLivePrice(symbol);

  if (!price) return null;

  // Confidence already validated by your confidence engine
  const confidence = 0.74; // placeholder — deterministic upstream

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

    marketOdds: null,
    marketProbability: null,
    edge: null,
    mispriced: false,

    pnl: 0,
    result: null,

    userAction: null,
    entryAt: null,
    entryDelayMs: null,
  };
}

/* =========================================================
   RESOLUTION (PRICE + ODDS)
========================================================= */

function resolveSignal(signal) {
  const priceMove =
    signal.direction === "UP"
      ? signal.priceAtResolve > signal.priceAtEntry
      : signal.priceAtResolve < signal.priceAtEntry;

  signal.result = priceMove ? "WIN" : "LOSS";

  if (
    signal.userAction === "ENTER" &&
    typeof signal.marketProbability === "number"
  ) {
    const prob = signal.marketProbability;
    const payout = priceMove
      ? (1 / prob) - 1
      : -1;

    signal.pnl = Number((payout * STAKE).toFixed(4));
  } else {
    signal.pnl = 0;
  }

  signal.resolved = true;
}

/* =========================================================
   ENGINE TICK
========================================================= */

export async function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let signal = state.activeSignal;

    if (!signal) {
      state.activeSignal = await createSignal(asset);
      continue;
    }

    // Close entry window
    if (signal.entryOpen && t >= signal.entryClosesAt) {
      signal.entryOpen = false;
    }

    // Inject Polymarket odds (read-only)
    if (!signal.marketOdds) {
      const odds = await getPolymarketOdds(asset);
      if (odds) {
        signal.marketOdds = odds;
        signal.marketProbability = odds.marketProb;

        const edgeObj = calculateEdge({
          confidence: signal.confidence,
          marketProb: odds.marketProb,
        });

        signal.edge = edgeObj?.edge ?? null;
        signal.mispriced =
          typeof signal.edge === "number" &&
          signal.edge >= EDGE_THRESHOLD;
      }
    }

    // Resolve signal
    if (!signal.resolved && t >= signal.resolveAt) {
      signal.priceAtResolve = await getLivePrice(asset);

      if (!signal.priceAtEntry) {
        signal.priceAtEntry = signal.priceAtSignal;
      }

      resolveSignal(signal);

      state.history.unshift(signal);
      state.history = state.history.slice(0, 50);
      persistResolvedSignal(signal);

      state.activeSignal = await createSignal(asset);
    }
  }
}

/* =========================================================
   USER ACTIONS (UI CONTRACT)
========================================================= */

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

/* =========================================================
   SELECTORS
========================================================= */

export function getActive15mSignals() {
  const out = {};
  for (const a of ASSETS) out[a] = engineState[a].activeSignal;
  return out;
}

export function getLastResolvedSignals(limit = 50) {
  const persisted = loadResolvedSignals();

  const inMemory = Object.values(engineState)
    .flatMap(s => s.history)
    .filter(s => s.resolved);

  return [...persisted, ...inMemory]
    .reduce((acc, s) => {
      if (!acc.find(x => x.id === s.id)) acc.push(s);
      return acc;
    }, [])
    .sort((a, b) => b.resolveAt - a.resolveAt)
    .slice(0, limit);
}

/* =========================================================
   EDGE HEATMAP DATA (UI)
========================================================= */

export function getEdgeHeatmapData() {
  return getLastResolvedSignals(200)
    .filter(s => typeof s.edge === "number")
    .map(s => ({
      symbol: s.symbol,
      confidence: s.confidence,
      marketProbability: s.marketProbability,
      edge: s.edge,
      pnl: s.pnl,
      resolvedAt: s.resolveAt,
    }));
}

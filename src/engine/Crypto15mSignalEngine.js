/* =========================================================
   Crypto 15m Signal Engine (PRICE-DRIVEN)
   - Real price resolution (Binance / CoinGecko feed)
   - Real PnL
   - Market mispricing edge detection
========================================================= */

import { getLivePrice } from "./priceFeed";
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

// Minimum edge vs market to flag mispricing
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
   UTILITIES
========================================================= */

const now = () => Date.now();

const generateId = symbol =>
  `${symbol}-15m-${Date.now()}`;

/* =========================================================
   CREATE SIGNAL (NO RANDOMNESS)
========================================================= */

async function createSignal(symbol) {
  const start = now();
  const entryPrice = await getLivePrice(symbol);

  // confidence already computed elsewhere in your system
  const confidence = 0.74; // placeholder — your existing confidence engine feeds this

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction: confidence >= 0.5 ? "UP" : "DOWN",

    confidence,
    confidenceBreakdown: null,

    createdAt: start,
    resolveAt: start + TIMEFRAME_MS,
    entryClosesAt: start + TIMEFRAME_MS * SAFE_ENTRY_RATIO,

    entryOpen: true,
    resolved: false,

    entryPrice,
    resolvePrice: null,

    pnl: null,
    result: null,

    // market comparison
    marketProbability: null,
    edge: null,
    mispriced: false,

    userAction: null,
    entryAt: null,
    entryDelayMs: null,
  };
}

/* =========================================================
   RESOLVE SIGNAL (PRICE DECIDES)
========================================================= */

async function resolveSignal(signal) {
  const resolvePrice = await getLivePrice(signal.symbol);
  signal.resolvePrice = resolvePrice;

  const priceMove =
    (resolvePrice - signal.entryPrice) / signal.entryPrice;

  const pnl =
    signal.direction === "UP"
      ? priceMove
      : -priceMove;

  signal.pnl = Number(pnl.toFixed(5));
  signal.result = pnl > 0 ? "WIN" : "LOSS";
  signal.resolved = true;

  // --- MARKET MISPRICING ---
  // marketProbability must be injected from Polymarket UI layer
  if (typeof signal.marketProbability === "number") {
    signal.edge = Number(
      (signal.confidence - signal.marketProbability).toFixed(4)
    );

    signal.mispriced = signal.edge > EDGE_THRESHOLD;
  }
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

    if (signal.entryOpen && t >= signal.entryClosesAt) {
      signal.entryOpen = false;
    }

    if (!signal.resolved && t >= signal.resolveAt) {
      await resolveSignal(signal);

      state.history.unshift(signal);
      state.history = state.history.slice(0, 50);

      persistResolvedSignal(signal);

      state.activeSignal = await createSignal(asset);
    }
  }
}

/* =========================================================
   USER ACTIONS (KEEP FOR UI)
========================================================= */

export function enterSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;

  s.userAction = "ENTER";
  s.entryAt = now();
  s.entryDelayMs = s.entryAt - s.createdAt;

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

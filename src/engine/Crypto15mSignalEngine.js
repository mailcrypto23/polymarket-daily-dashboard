// src/engine/Crypto15mSignalEngine.js

import { upsertSignal } from "./signalStore";

/* =========================================================
   CONFIG
========================================================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;

/* =========================================================
   ENGINE STATE (IN-MEMORY)
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
  `${symbol}-15m-${now()}`;

const randomDirection = () =>
  Math.random() > 0.5 ? "UP" : "DOWN";

const randomConfidence = () =>
  +(0.62 + Math.random() * 0.18).toFixed(2);

const randomPrice = base =>
  +(base * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2);

function computeTimes() {
  const start = now();
  return {
    start,
    resolveAt: start + TIMEFRAME_MS,
    entryClosesAt: start + TIMEFRAME_MS * SAFE_ENTRY_RATIO,
  };
}

/* =========================================================
   CREATE SIGNAL
========================================================= */

function createSignal(symbol) {
  const { start, resolveAt, entryClosesAt } = computeTimes();
  const entryPrice = randomPrice(1000 + Math.random() * 500);

  return {
    id: generateId(symbol),
    asset: symbol,
    timeframe: "15m",
    direction: randomDirection(),
    confidence: randomConfidence(),
    createdAt: start,
    resolveAt,
    entryClosesAt,
    entryOpen: true,
    entryPrice,
    exitPrice: null,
    resolved: false,
    outcome: null, // WIN | LOSS
    userAction: null, // ENTER | SKIP
  };
}

/* =========================================================
   RESOLVE SIGNAL (PERSIST HERE)
========================================================= */

function resolveSignal(signal) {
  const exitPrice = randomPrice(signal.entryPrice);

  const isWin =
    (signal.direction === "UP" && exitPrice > signal.entryPrice) ||
    (signal.direction === "DOWN" && exitPrice < signal.entryPrice);

  signal.exitPrice = exitPrice;
  signal.resolved = true;
  signal.outcome = isWin ? "WIN" : "LOSS";
  signal.resolvedAt = now();

  // 🔥 PERSIST TO STORE (THIS IS THE FIX)
  upsertSignal({
    id: signal.id,
    asset: signal.asset,
    direction: signal.direction,
    confidence: signal.confidence,
    entryPrice: signal.entryPrice,
    exitPrice: signal.exitPrice,
    outcome: signal.outcome,
    createdAt: signal.createdAt,
    resolvedAt: signal.resolvedAt,
    timeframe: signal.timeframe,
  });

  return signal;
}

/* =========================================================
   ENGINE LOOP
========================================================= */

export function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let signal = state.activeSignal;

    if (!signal) {
      state.activeSignal = createSignal(asset);
      continue;
    }

    if (signal.entryOpen && t >= signal.entryClosesAt) {
      signal.entryOpen = false;
    }

    if (!signal.resolved && t >= signal.resolveAt) {
      resolveSignal(signal);
      state.history.unshift(signal);
      state.history = state.history.slice(0, 50);
      state.activeSignal = createSignal(asset);
    }
  }
}

/* =========================================================
   USER ACTIONS
========================================================= */

export function enterSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;
  s.userAction = "ENTER";
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

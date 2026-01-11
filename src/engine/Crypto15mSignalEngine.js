// src/engine/Crypto15mSignalEngine.js

/* =========================================================
   CONFIG
========================================================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;

/* =========================================================
   ENGINE STATE (PURE LOGIC)
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

const randomDirection = () =>
  Math.random() > 0.5 ? "UP" : "DOWN";

const randomConfidence = () =>
  +(0.65 + Math.random() * 0.2).toFixed(2); // 65–85%

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

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction: randomDirection(),
    confidence: randomConfidence(),
    createdAt: start,
    resolveAt,
    entryClosesAt,
    entryOpen: true,
    resolved: false,
    result: null,
    userAction: null,

    // used by ConfidenceExplanation.jsx
    confidenceBreakdown: {
      momentum: Math.round(70 + Math.random() * 20),
      trend: Math.round(65 + Math.random() * 20),
      volatility: Math.round(60 + Math.random() * 25),
      liquidity: Math.round(65 + Math.random() * 20),
      timePenalty: 0,
      finalConfidence: 0,
    },
  };
}

/* =========================================================
   RESOLUTION
========================================================= */

function resolveSignal(signal) {
  signal.resolved = true;
  signal.result =
    Math.random() < signal.confidence ? "WIN" : "LOSS";
  return signal;
}

/* =========================================================
   ENGINE TICK
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
      signal.confidenceBreakdown.timePenalty = 5;
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

export function getLastResolvedSignals(limit = 4) {
  return Object.values(engineState)
    .flatMap(s => s.history)
    .filter(s => s.resolved)
    .sort((a, b) => b.resolveAt - a.resolveAt)
    .slice(0, limit);
}

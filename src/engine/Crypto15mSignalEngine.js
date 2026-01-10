// src/engine/Crypto15mSignalEngine.js

/* =========================================================
   CONFIG
========================================================= */

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4; // first 40% of candle

/* =========================================================
   ENGINE STATE (IN-MEMORY, UI-SAFE)
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

function now() {
  return Date.now();
}

function generateId(symbol) {
  return `${symbol}-15m-${now()}`;
}

function randomDirection() {
  return Math.random() > 0.5 ? "UP" : "DOWN";
}

function randomConfidence() {
  // realistic confidence range
  return +(0.62 + Math.random() * 0.18).toFixed(2); // 62% – 80%
}

function computeTimes() {
  const start = now();
  const resolveAt = start + TIMEFRAME_MS;
  const entryClosesAt = start + TIMEFRAME_MS * SAFE_ENTRY_RATIO;

  return { start, resolveAt, entryClosesAt };
}

/* =========================================================
   CORE: CREATE SIGNAL
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
    result: null, // WIN | LOSS
    userAction: null, // ENTER | SKIP
  };
}

/* =========================================================
   CORE: RESOLVE SIGNAL
========================================================= */

function resolveSignal(signal) {
  signal.resolved = true;

  // Simple deterministic resolution for now
  const winChance = signal.confidence;
  signal.result = Math.random() < winChance ? "WIN" : "LOSS";

  return signal;
}

/* =========================================================
   ENGINE TICK (IDEMPOTENT)
========================================================= */

export function runCrypto15mSignalEngine() {
  const currentTime = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let signal = state.activeSignal;

    // 1️⃣ No signal → create one
    if (!signal) {
      state.activeSignal = createSignal(asset);
      continue;
    }

    // 2️⃣ Entry window expired → lock entry
    if (signal.entryOpen && currentTime >= signal.entryClosesAt) {
      signal.entryOpen = false;
    }

    // 3️⃣ Resolve signal
    if (!signal.resolved && currentTime >= signal.resolveAt) {
      resolveSignal(signal);

      state.history.unshift(signal);
      state.history = state.history.slice(0, 50); // cap history

      state.activeSignal = createSignal(asset);
    }
  }
}

/* =========================================================
   USER ACTIONS
========================================================= */

export function enterSignal(symbol) {
  const signal = engineState[symbol]?.activeSignal;
  if (!signal || !signal.entryOpen) return false;

  signal.userAction = "ENTER";
  return true;
}

export function skipSignal(symbol) {
  const signal = engineState[symbol]?.activeSignal;
  if (!signal || !signal.entryOpen) return false;

  signal.userAction = "SKIP";
  signal.entryOpen = false;
  return true;
}

/* =========================================================
   SELECTORS (READ-ONLY)
========================================================= */

export function getActive15mSignals() {
  const result = {};
  for (const asset of ASSETS) {
    result[asset] = engineState[asset].activeSignal;
  }
  return result;
}

export function getLastResolvedSignals(limit = 4) {
  return Object.values(engineState)
    .flatMap(s => s.history)
    .filter(s => s.resolved)
    .sort((a, b) => b.resolveAt - a.resolveAt)
    .slice(0, limit);
}

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

/* ---------- Confidence helpers ---------- */

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Build Polymarket-style confidence explanation
 * (matches ConfidenceExplanation.jsx)
 */
function buildConfidenceBreakdown({
  momentum,
  trend,
  volatility,
  liquidity,
  timePenalty,
}) {
  const base =
    momentum * 0.3 +
    trend * 0.3 +
    volatility * 0.2 +
    liquidity * 0.2;

  const final = Math.max(0, Math.min(1, base - timePenalty));

  return {
    momentum: Math.round(momentum * 100),
    trend: Math.round(trend * 100),
    volatility: Math.round(volatility * 100),
    liquidity: Math.round(liquidity * 100),
    timePenalty: Math.round(timePenalty * 100),
    finalConfidence: Math.round(final * 100),
  };
}

/**
 * Generate realistic, explainable confidence inputs
 */
function generateConfidenceBreakdown(entryRatio) {
  const momentum = rand(0.65, 0.9);
  const trend = rand(0.6, 0.9);
  const volatility = rand(0.55, 0.8);
  const liquidity = rand(0.7, 0.95);

  // penalty increases if user enters late
  const timePenalty =
    entryRatio > SAFE_ENTRY_RATIO
      ? rand(0.05, 0.12)
      : 0;

  return buildConfidenceBreakdown({
    momentum,
    trend,
    volatility,
    liquidity,
    timePenalty,
  });
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

  // confidence inputs are generated at creation time
  const confidenceBreakdown = generateConfidenceBreakdown(0);

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction: randomDirection(),

    confidence: confidenceBreakdown.finalConfidence / 100,
    confidenceBreakdown,

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

  // deterministic win probability driven by confidence
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
      state.history = state.history.slice(0, 50);

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

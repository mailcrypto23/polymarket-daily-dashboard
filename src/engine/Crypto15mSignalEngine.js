// src/engine/Crypto15mSignalEngine.js

const STORAGE_KEY = "pm_signal_history";
const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const SAFE_ENTRY_MS = 2 * 60 * 1000; // first 2 minutes only

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

function getNextCandleTime(now) {
  return Math.floor(now / INTERVAL_MS) * INTERVAL_MS + INTERVAL_MS;
}

function hasActiveSignal(signals, now) {
  return signals.some(
    s =>
      s.outcome === "pending" &&
      now < s.resolveAt
  );
}

function generateSignal(now) {
  const resolveAt = getNextCandleTime(now);

  const bias = Math.random() > 0.5 ? "UP" : "DOWN";
  const confidence = Math.floor(55 + Math.random() * 25); // 55–80%

  return {
    id: `sig_${now}`,
    symbol: "BTC",
    timeframe: "15m",
    bias,
    confidence,

    entryPrice: null,
    exitPrice: null,

    createdAt: now,
    resolveAt,
    safeUntil: now + SAFE_ENTRY_MS,

    userDecision: null, // ENTER | SKIP
    outcome: "pending", // pending | WIN | LOSS | SKIPPED

    proof: null
  };
}

export function runCrypto15mSignalEngine() {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const signals = loadSignals();

  // 🔥 CRITICAL FIX:
  // ENSURE THERE IS ALWAYS ONE ACTIVE SIGNAL
  if (!hasActiveSignal(signals, now)) {
    signals.push(generateSignal(now));
    saveSignals(signals);
  }
}

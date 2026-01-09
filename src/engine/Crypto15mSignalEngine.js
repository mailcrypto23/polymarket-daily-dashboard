// src/engine/Crypto15mSignalEngine.js
// FINAL – build-safe, Polymarket-style 15m signal engine

const STORAGE_KEY = "pm_signal_history";

const SIGNAL_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SAFE_WINDOW_RATIO = 0.4; // first 40% is SAFE

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

function hasActivePendingSignal(signals, now) {
  return signals.some(
    s =>
      s &&
      s.outcome === "pending" &&
      typeof s.resolveAt === "number" &&
      now < s.resolveAt
  );
}

function generateSignal(now) {
  const resolveAt = now + SIGNAL_DURATION_MS;
  const safeUntil = now + SIGNAL_DURATION_MS * SAFE_WINDOW_RATIO;

  return {
    id: `sig_${now}`,
    symbol: "BTC",
    market: "Bitcoin 15m",
    timeframe: "15m",

    bias: Math.random() > 0.5 ? "UP" : "DOWN",
    confidence: Math.floor(60 + Math.random() * 25), // 60–85

    createdAt: now,
    resolveAt,
    safeUntil,

    userDecision: null, // ENTER | SKIP
    entryPrice: null,
    exitPrice: null,

    outcome: "pending", // pending → WIN | LOSS | SKIPPED
    proof: null
  };
}

/**
 * ✅ THE ONLY EXPORTED ENGINE FUNCTION
 * This name MUST match backgroundRunner.js import
 */
export function runCrypto15mSignalEngine() {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const signals = loadSignals();

  // Keep history but remove very old resolved signals (optional hygiene)
  const cleaned = signals.filter(
    s =>
      s.outcome === "pending" ||
      (typeof s.resolveAt === "number" &&
        now - s.resolveAt < 60 * 60 * 1000)
  );

  // If a pending signal already exists, do nothing
  if (hasActivePendingSignal(cleaned, now)) {
    saveSignals(cleaned);
    return;
  }

  // Otherwise create EXACTLY ONE new signal
  const newSignal = generateSignal(now);
  cleaned.push(newSignal);

  saveSignals(cleaned);
}

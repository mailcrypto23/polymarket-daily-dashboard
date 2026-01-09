// src/engine/Crypto15mSignalEngine.js

const STORAGE_KEY = "pm_signal_history";

// 15 minutes
const SIGNAL_DURATION_MS = 15 * 60 * 1000;

// SAFE window = first 40% of the signal
const SAFE_WINDOW_RATIO = 0.4;

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
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
      s.outcome === "pending" &&
      typeof s.resolveAt === "number" &&
      now < s.resolveAt
  );
}

function generateSignal(now) {
  const resolveAt = now + SIGNAL_DURATION_MS;
  const safeUntil = now + SIGNAL_DURATION_MS * SAFE_WINDOW_RATIO;

  const bias = Math.random() > 0.5 ? "UP" : "DOWN";
  const confidence = Math.floor(55 + Math.random() * 30); // 55–85%

  return {
    id: `sig_${now}`,
    symbol: "BTC",
    timeframe: "15m",

    bias,
    confidence,

    createdAt: now,
    resolveAt,
    safeUntil,

    entryPrice: null,
    exitPrice: null,

    userDecision: null, // ENTER | SKIP
    outcome: "pending", // pending | WIN | LOSS | SKIPPED

    proof: null
  };
}

/**
 * ✅ FINAL ENGINE ENTRYPOINT
 * MUST match backgroundRunner import
 */
export function runCrypto15mSignalEngine() {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const signals = loadSignals();

  // Remove fully resolved & expired signals (keep history clean)
  const cleaned = signals.filter(
    s =>
      s.outcome === "pending" ||
      (s.outcome !== "pending" && now - s.resolveAt < 60 * 60 * 1000)
  );

  // If a pending signal already exists, do NOTHING
  if (hasActivePendingSignal(cleaned, now)) {
    saveSignals(cleaned);
    return;
  }

  // Otherwise, create exactly ONE new signal
  const newSignal = generateSignal(now);
  cleaned.push(newSignal);

  saveSignals(cleaned);
}

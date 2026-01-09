// src/engine/tradeDecisionEngine.js

const STORAGE_KEY = "pm_signal_history";

const CONFIDENCE_THRESHOLD = 75;
const TF_MS = 15 * 60 * 1000;
const SAFE_WINDOW_PCT = 0.6;

export function autoEnterSignals() {
  if (typeof window === "undefined") return;

  let signals = [];
  try {
    signals = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return;
  }

  let changed = false;
  const now = Date.now();

  signals.forEach(signal => {
    if (
      signal &&
      signal.outcome === "pending" &&
      !signal.userDecision &&
      typeof signal.createdAt === "number" &&
      typeof signal.confidence === "number"
    ) {
      const elapsed = now - signal.createdAt;
      const safeWindowMs = TF_MS * SAFE_WINDOW_PCT;

      // 🚨 STRICT RULES (NO EXCEPTIONS)
      if (
        signal.confidence >= CONFIDENCE_THRESHOLD &&
        elapsed <= safeWindowMs
      ) {
        signal.userDecision = "ENTER";
        signal.entryPrice = signal.priceAtSignal;
        signal.enteredAt = now;

        console.log(
          `[tradeDecision] ENTER ${signal.id} @ ${signal.entryPrice}`
        );
        changed = true;
      } else if (elapsed > safeWindowMs) {
        signal.userDecision = "SKIP";
        signal.skippedAt = now;
        changed = true;
      }
    }
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  }
}

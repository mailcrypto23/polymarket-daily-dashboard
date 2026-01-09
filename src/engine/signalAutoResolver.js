// src/engine/signalResolver.js

const STORAGE_KEY = "pm_signal_history";

export function resolveSignals(getLivePrice) {
  if (typeof window === "undefined") return;
  if (typeof getLivePrice !== "function") return;

  let signals = [];
  try {
    signals = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return;
  }

  const now = Date.now();
  let changed = false;

  signals.forEach(signal => {
    if (
      signal &&
      signal.outcome === "pending" &&
      signal.userDecision === "ENTER" &&
      typeof signal.resolveAt === "number" &&
      now >= signal.resolveAt
    ) {
      const exitPrice = getLivePrice(signal.symbol);

      if (typeof exitPrice !== "number") return;

      signal.exitPrice = exitPrice;
      signal.resolvedAt = now;

      // 🔥 RESOLUTION LOGIC
      if (signal.bias === "UP") {
        signal.outcome =
          exitPrice > signal.entryPrice ? "WIN" : "LOSS";
      } else {
        signal.outcome =
          exitPrice < signal.entryPrice ? "WIN" : "LOSS";
      }

      console.log(
        `[resolver] ${signal.id} → ${signal.outcome} (${signal.entryPrice} → ${exitPrice})`
      );

      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  }
}

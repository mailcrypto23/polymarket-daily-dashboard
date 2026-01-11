// src/engine/signalAutoResolver.js

import { getLivePrice } from "./priceFeed";
import { logResolvedSignal } from "./signalLogger";
import { getActiveSignals, updateSignal } from "./signalStore";

// Resolve signals whose resolveAt has passed
export function resolveExpiredSignals() {
  const now = Date.now();
  const activeSignals = getActiveSignals();

  activeSignals.forEach(signal => {
    if (signal.resolvedAt) return;
    if (now < signal.resolveAt) return;

    const price = getLivePrice(signal.asset);
    if (!price) return;

    const isWin =
      signal.direction === "UP"
        ? price > signal.entryPrice
        : price < signal.entryPrice;

    updateSignal(signal.id, {
      exitPrice: price,
      resolvedAt: now,
      outcome: isWin ? "WIN" : "LOSS",
    });

    logResolvedSignal({
      ...signal,
      exitPrice: price,
      resolvedAt: now,
      outcome: isWin ? "WIN" : "LOSS",
    });
  });
}

// Used by TractionPanel
export function getResolvedSignals(limit = 4) {
  try {
    const all = JSON.parse(
      localStorage.getItem("pm_signal_history") || "[]"
    );

    return all
      .filter(s => s.outcome)
      .sort((a, b) => b.resolvedAt - a.resolvedAt)
      .slice(0, limit);
  } catch {
    return [];
  }
}

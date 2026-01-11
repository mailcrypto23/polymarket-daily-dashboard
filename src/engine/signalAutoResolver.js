// src/engine/signalAutoResolver.js
// Responsible for resolving expired 15m signals into WIN / LOSS
// SAFE: analytics-only, no trading execution

import { getLivePrice } from "./priceFeed";

const STORAGE_KEY = "crypto_15m_signals";

/**
 * Resolve all expired signals
 */
export async function resolveSignals() {
  let signals = [];

  try {
    signals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return;
  }

  const now = Date.now();
  let updated = false;

  for (const signal of signals) {
    // Skip already resolved
    if (signal.outcome) continue;

    // Skip if not yet time
    if (now < signal.resolveAt) continue;

    const exitPrice = await getLivePrice(signal.asset);

    if (!exitPrice || !signal.entryPrice) continue;

    signal.exitPrice = exitPrice;
    signal.resolvedAt = now;

    // Determine WIN / LOSS
    if (signal.direction === "UP") {
      signal.outcome =
        exitPrice > signal.entryPrice ? "WIN" : "LOSS";
    } else {
      signal.outcome =
        exitPrice < signal.entryPrice ? "WIN" : "LOSS";
    }

    updated = true;
  }

  if (updated) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(signals)
    );
  }
}

/**
 * Get last N resolved signals (newest first)
 */
export function getResolvedSignals(limit = 4) {
  try {
    const signals =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    return signals
      .filter(s => s.outcome)
      .sort((a, b) => b.resolvedAt - a.resolvedAt)
      .slice(0, limit);
  } catch {
    return [];
  }
}

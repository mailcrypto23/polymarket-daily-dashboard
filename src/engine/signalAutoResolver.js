// src/engine/signalAutoResolver.js

import { getLivePrice } from "./priceFeed";
import {
  getActive15mSignals,
  removeActiveSignal,
} from "./Crypto15mSignalEngine";

const HISTORY_KEY = "pm_signal_history";

/**
 * Resolve all expired 15m signals
 * Safe to run every second
 */
export async function resolveExpiredSignals() {
  const activeSignals = getActive15mSignals();
  const now = Date.now();

  for (const asset in activeSignals) {
    const signal = activeSignals[asset];

    if (signal.resolved) continue;
    if (now < signal.resolveAt) continue;

    try {
      const exitPrice = await getLivePrice(asset);
      const outcome = determineOutcome(signal, exitPrice);

      const resolvedSignal = {
        ...signal,
        exitPrice,
        resolvedAt: now,
        outcome,
        resolved: true,
      };

      persistResolvedSignal(resolvedSignal);
      removeActiveSignal(asset);

      console.log(
        `[RESOLVED] ${asset} ${signal.direction} → ${outcome}`
      );
    } catch (err) {
      console.error(
        `[RESOLVE ERROR] ${asset}`,
        err.message
      );
    }
  }
}

/**
 * Decide WIN / LOSS
 */
function determineOutcome(signal, exitPrice) {
  if (signal.direction === "UP") {
    return exitPrice > signal.entryPrice ? "WIN" : "LOSS";
  }

  if (signal.direction === "DOWN") {
    return exitPrice < signal.entryPrice ? "WIN" : "LOSS";
  }

  return "LOSS";
}

/**
 * Store resolved signal proof
 */
function persistResolvedSignal(signal) {
  let history = [];

  try {
    history = JSON.parse(
      localStorage.getItem(HISTORY_KEY)
    ) || [];
  } catch {
    history = [];
  }

  history.unshift(signal);

  // keep last 100 signals
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, 100))
  );
}

/**
 * Public helper for UI
 */
export function getResolvedSignals(limit = 4) {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY)
    ) || [];

    return history.slice(0, limit);
  } catch {
    return [];
  }
}

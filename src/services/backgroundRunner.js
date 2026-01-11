// src/services/backgroundRunner.js

import { runCrypto15mSignalEngine } from "../engine/Crypto15mSignalEngine";
import { resolveExpiredSignals } from "../engine/signalAutoResolver";

let started = false;

/**
 * Starts background engine loop
 * - Generates 15m signals
 * - Auto-resolves expired signals
 * Safe to call once (guarded)
 */
export function startBackgroundRunner() {
  if (started) return;
  started = true;

  console.log("[ENGINE] Background runner started");

  setInterval(async () => {
    try {
      runCrypto15mSignalEngine();
      await resolveExpiredSignals();
    } catch (err) {
      console.error("[ENGINE ERROR]", err);
    }
  }, 1000);
}

/* =========================================================
   Background Engine Runner (FINAL)
   - Runs price-driven Crypto15mSignalEngine
   - No legacy auto-resolvers
   - No fake seeding
========================================================= */

import { runCrypto15mSignalEngine } from "../engine/Crypto15mSignalEngine";

let intervalId = null;

export function startBackgroundRunner() {
  if (intervalId) return; // prevent double start

  intervalId = setInterval(() => {
    runCrypto15mSignalEngine();
  }, 1000); // 1s tick
}

export function stopBackgroundRunner() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

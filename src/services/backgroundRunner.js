/* =========================================================
   Background Engine Runner (FINAL)
   - Safe singleton runner
   - Fast dev loop
   - No duplicate intervals
========================================================= */

import { runCrypto15mSignalEngine } from "../engine/Crypto15mSignalEngine";

let started = false;
let intervalId = null;

export function startBackgroundRunner() {
  if (started) return;
  started = true;

  // Immediate first run
  runCrypto15mSignalEngine().catch(console.error);

  // Continuous loop
  intervalId = setInterval(() => {
    runCrypto15mSignalEngine().catch(console.error);
  }, import.meta.env.DEV ? 3_000 : 1_000);
}

export function stopBackgroundRunner() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    started = false;
  }
}

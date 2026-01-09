// src/services/backgroundRunner.js

import { runCrypto15mSignalEngine } from "../engine/Crypto15mSignalEngine";
import { resolveSignals } from "../engine/signalAutoResolver";
import { getLivePrice } from "../engine/priceFeed";

let started = false;

export function startBackgroundRunner() {
  if (started) return;
  started = true;

  setInterval(() => {
    runCrypto15mSignalEngine();
    resolveSignals(getLivePrice);
  }, 1000);
}

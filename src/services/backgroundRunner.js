import { autoEnterSignals } from "../engine/tradeDecisionEngine.js";
import { resolveSignals } from "../engine/signalAutoResolver.js";
import { getLivePrice } from "../engine/priceFeed.js";

let started = false;

export function startBackgroundRunner() {
  if (started) return;
  started = true;

  try {
    autoEnterSignals();
    resolveSignals(getLivePrice);
  } catch (e) {
    console.error("Background runner init error", e);
  }

  setInterval(() => {
    try {
      autoEnterSignals();
      resolveSignals(getLivePrice);
    } catch (e) {
      console.error("Background runner tick error", e);
    }
  }, 15_000);
}

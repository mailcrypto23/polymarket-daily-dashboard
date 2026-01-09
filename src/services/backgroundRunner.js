// src/services/backgroundRunner.js

import { autoEnterSignals } from "../engine/tradeDecisionEngine";
import { resolveSignals } from "../engine/signalResolver";
import { getLivePrice } from "../engine/priceFeed";

let started = false;

export function startBackgroundRunner() {
  // 🔒 Prevent multiple runners (VERY IMPORTANT)
  if (started) return;
  started = true;

  console.log("[backgroundRunner] started");

  // 🔁 Run every second (Polymarket-style)
  setInterval(() => {
    try {
      // 1️⃣ Apply auto-entry rules (confidence + SAFE window)
      autoEnterSignals();

      // 2️⃣ Resolve expired signals with price proof
      resolveSignals(getLivePrice);
    } catch (err) {
      console.error("[backgroundRunner] error", err);
    }
  }, 1000);
}

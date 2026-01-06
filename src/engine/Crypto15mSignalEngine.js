// src/engine/Crypto15mSignalEngine.js
// SAFE v1 – analytics only (no execution, no API)

import { logSignal, resolveSignal } from "./signalLogger";

// =======================================================
// CONFIG
// =======================================================

// 4 fixed crypto markets (15m)
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

// SAFE default (no real prices yet)
const DATA_MODE = "mock"; // "mock" | "real"

// =======================================================
// MOCK PRICE ENGINE (SAFE)
// =======================================================
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// =======================================================
// SIGNAL GENERATION (WITH CONFIDENCE TIERS)
// =======================================================
function generateSignal(market) {
  const basePrice = 100 + Math.random() * 50;
  const entryPrice = mockPrice(basePrice);
  const currentPrice = mockPrice(entryPrice);

  const momentum = currentPrice - entryPrice;
  const absMove = Math.abs(momentum);

  // ---- Confidence tiers (55 → 75) ----
  let confidence;
  if (absMove < 0.15) confidence = 55 + absMove * 10;        // weak
  else if (absMove < 0.30) confidence = 60 + absMove * 12;  // moderate
  else if (absMove < 0.45) confidence = 65 + absMove * 15;  // strong
  else confidence = 70 + absMove * 18;                      // very strong

  confidence = Math.min(75, Math.round(confidence));

  return {
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence,
    entryPrice
  };
}

// =======================================================
// ENGINE TICK (CALLED EVERY 15 MINUTES BY DASHBOARD)
// =======================================================
export function runCrypto15mEngine() {
  MARKETS.forEach(market => {
    const signalData = generateSignal(market);

    // 1️⃣ Log signal as PENDING
    const signal = logSignal({
      market: signalData.market,
      side: signalData.side,
      confidence: signalData.confidence,
      price: signalData.entryPrice,
      source: "crypto-15m-momentum-v1"
    });

    // 2️⃣ Resolve after 15 minutes
    setTimeout(() => {
      const resolvePrice =
        DATA_MODE === "mock"
          ? mockPrice(signalData.entryPrice)
          : signalData.entryPrice; // real mode placeholder

      resolveSignal(signal.id, resolvePrice);
    }, 15 * 60 * 1000);
  });
}

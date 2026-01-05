// src/engine/Crypto15mSignalEngine.js
// SAFE v1 – analytics only (no execution, no API)

import { logSignal, resolveSignal } from "./signalLogger";

// 4 fixed crypto markets (15m)
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

// ====== DATA MODE ======
const DATA_MODE = "mock"; // "mock" | "real"

// ====== MOCK PRICE (SAFE) ======
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// ====== SIGNAL LOGIC ======
function generateSignal(market) {
  const basePrice = 100 + Math.random() * 50;
  const prevPrice = mockPrice(basePrice);
  const currentPrice = mockPrice(prevPrice);

  const momentum = currentPrice - prevPrice;

  const confidence = Math.min(
    85,
    Math.max(55, Math.abs(momentum) * 120)
  );

  return {
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence.toFixed(1)),
    price: prevPrice
  };
}

// ====== ENGINE TICK ======
export function runCrypto15mEngine() {
  MARKETS.forEach(market => {
    const signalData = generateSignal(market);

    // 1️⃣ LOG SIGNAL (pending)
    const signal = logSignal({
      market: signalData.market,
      side: signalData.side,
      confidence: signalData.confidence,
      price: signalData.price,
      source: "crypto-15m-momentum-v1"
    });

    // 2️⃣ RESOLVE AFTER 15 MINUTES
    setTimeout(() => {
      const resolvePrice =
        DATA_MODE === "mock"
          ? mockPrice(signalData.price)
          : signalData.price; // real mode placeholder

      resolveSignal(signal.id, resolvePrice);
    }, 15 * 60 * 1000);
  });
}

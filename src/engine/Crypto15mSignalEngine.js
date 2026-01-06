// SAFE v1 – analytics only (no execution, no APIs)

import { logSignal, resolveSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history"; // 🔒 SINGLE SOURCE OF TRUTH

// Fixed crypto markets
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

// ===== MOCK PRICE =====
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// ===== WINDOW UTILS =====
function current15mBucket() {
  return Math.floor(Date.now() / (15 * 60 * 1000));
}

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ===== SIGNAL GENERATION =====
function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const momentum = next - entry;
  const confidence = Math.min(
    85,
    Math.max(55, Math.abs(momentum) * 120)
  );

  return {
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence.toFixed(1)),
    price: entry
  };
}

// ===== ENGINE =====
export function runCrypto15mEngine() {
  const bucket = current15mBucket();
  const signals = loadSignals();

  // 1️⃣ Resolve expired signals
  signals.forEach(s => {
    if (
      s.outcome === "pending" &&
      Date.now() >= s.resolveAt
    ) {
      const finalPrice = mockPrice(s.entryPrice);
      resolveSignal(s.id, finalPrice);
    }
  });

  // 2️⃣ Prevent duplicates in same window
  const alreadyGenerated = signals.some(
    s =>
      s.timeframe === "15m" &&
      s.bucket === bucket
  );

  if (alreadyGenerated) return;

  // 3️⃣ Generate fresh signals
  MARKETS.forEach(market => {
    const data = generateSignal(market);

    logSignal({
      market: data.market,
      side: data.side,
      confidence: data.confidence,
      price: data.price,
      source: "crypto-15m-momentum-v1",
      timeframe: "15m",
      bucket
    });
  });
}

// ===== OPTIONAL RESET (DEV ONLY) =====
export function resetCryptoSignals() {
  localStorage.removeItem(STORAGE_KEY);
}

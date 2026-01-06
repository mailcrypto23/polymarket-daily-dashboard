import { logSignal, resolveSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history"; // 🔒 single source of truth

// Fixed crypto markets
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

// ===== MOCK PRICE (SAFE) =====
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// ===== TIME WINDOW =====
function current15mBucket() {
  return Math.floor(Date.now() / (15 * 60 * 1000));
}

// ===== STORAGE =====
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
export function runCrypto15mEngine({ force = false } = {}) {
  const bucket = current15mBucket();
  const signals = loadSignals();

  // 1️⃣ Resolve expired signals (self-healing)
  signals.forEach(s => {
    if (
      s.outcome === "pending" &&
      typeof s.resolveAt === "number" &&
      Date.now() >= s.resolveAt
    ) {
      const finalPrice = mockPrice(s.entryPrice);
      resolveSignal(s.id, finalPrice);
    }
  });

  // Reload signals after resolution
  const updatedSignals = loadSignals();

  // 2️⃣ Generate per-market per-bucket (NO GLOBAL BLOCK)
  MARKETS.forEach(market => {
    const exists = updatedSignals.some(
      s =>
        s.timeframe === "15m" &&
        s.bucket === bucket &&
        s.symbol === market.symbol
    );

    if (exists && !force) return;

    const data = generateSignal(market);

    logSignal({
      market: data.market,
      symbol: data.symbol,
      side: data.side,
      confidence: data.confidence,
      price: data.price,
      source: "crypto-15m-momentum-v1",
      timeframe: "15m",
      bucket
    });
  });
}

// ===== DEV RESET (OPTIONAL) =====
export function resetCryptoSignals() {
  localStorage.removeItem(STORAGE_KEY);
}

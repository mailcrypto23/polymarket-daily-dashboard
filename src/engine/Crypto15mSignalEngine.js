// SAFE v1 – analytics only (no execution, no APIs)

import { logSignal, resolveSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history"; // 🔒 single source of truth
const ENGINE_META_KEY = "pm_engine_meta"; // engine state

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

// ===== STORAGE =====
function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadMeta() {
  try {
    return JSON.parse(localStorage.getItem(ENGINE_META_KEY)) || {};
  } catch {
    return {};
  }
}

function saveMeta(meta) {
  localStorage.setItem(ENGINE_META_KEY, JSON.stringify(meta));
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
  const meta = loadMeta();

  // 1️⃣ Resolve expired signals
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

  // Reload after resolution
  const updatedSignals = loadSignals();

  // 2️⃣ Prevent duplicate generation per bucket
  const alreadyGenerated =
    meta.lastBucket === bucket && !force;

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

  // 4️⃣ Persist engine state
  saveMeta({ lastBucket: bucket });
}

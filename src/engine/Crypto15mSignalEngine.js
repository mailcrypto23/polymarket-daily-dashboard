// SAFE v1 – analytics only (NO JSX, NO REACT)

import { logSignal, resolveSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

function bucket15m() {
  return Math.floor(Date.now() / (15 * 60 * 1000));
}

function loadMeta() {
  return JSON.parse(localStorage.getItem(META_KEY) || "{}");
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function mockPrice(base) {
  return +(base * (1 + (Math.random() - 0.5) * 0.005)).toFixed(2);
}

function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  return {
    market: market.name,
    symbol: market.symbol,
    side: next >= entry ? "YES" : "NO",
    confidence: Math.min(90, Math.max(55, Math.abs(next - entry) * 120)),
    entryPrice: entry,
    timeframe: "15m",
    source: "crypto-15m-engine"
  };
}

export function runCrypto15mEngine({ force = false } = {}) {
  const bucket = bucket15m();
  const meta = loadMeta();

  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(market => {
    logSignal({
      ...generateSignal(market),
      bucket,
      outcome: "pending",
      createdAt: Date.now()
    });
  });

  saveMeta({ lastBucket: bucket });
}

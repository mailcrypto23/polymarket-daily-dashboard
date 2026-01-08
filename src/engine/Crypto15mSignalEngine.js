// SAFE v3 – analytics + notifier (NO JSX, NO REACT)

import { logSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const TF = 15 * 60 * 1000;

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

function bucket15m() {
  return Math.floor(Date.now() / TF);
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function mockPrice(base) {
  return +(base * (1 + (Math.random() - 0.5) * 0.006)).toFixed(2);
}

function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const bias = next >= entry ? "YES" : "NO";

  return {
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence: Math.min(65, Math.max(55, Math.abs(next - entry) * 120)),
    createdAt: Date.now(),
    resolveAt: Date.now() + TF,
    notifyAt: Date.now() + 5_000, // popup after 5s
    timeframe: "15m",
    outcome: "pending"
  };
}

export function runCrypto15mEngine({ force = false } = {}) {
  const meta = load(META_KEY, {});
  const bucket = bucket15m();

  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(market => {
    logSignal(generateSignal(market));
  });

  save(META_KEY, { lastBucket: bucket });
}

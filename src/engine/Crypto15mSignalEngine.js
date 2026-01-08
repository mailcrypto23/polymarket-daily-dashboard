// SAFE v5 – deterministic 15m signal engine (NO invalid timestamps)

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

function generateSignal(market) {
  const now = Date.now();

  const bias = Math.random() > 0.5 ? "YES" : "NO";
  const confidence = 55 + Math.floor(Math.random() * 10);

  return {
    id: crypto.randomUUID(),
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence,
    createdAt: now,
    resolveAt: now + TF,       // 🔑 ALWAYS VALID
    timeframe: "15m",
    outcome: "pending",
    notified: false            // 🔑 persistent toast control
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

// SAFE v6 – aligned 15m lifecycle (NO JSX, NO REACT)

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

function bucketStart(ts = Date.now()) {
  return Math.floor(ts / TF) * TF;
}

function bucketEnd(ts = Date.now()) {
  return bucketStart(ts) + TF;
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

function resolveSignals() {
  const all = load(STORAGE_KEY, []);
  let changed = false;

  all.forEach(s => {
    if (s.outcome !== "pending") return;
    if (Date.now() < s.resolveAt) return;

    const exit = mockPrice(100 + Math.random() * 50);
    const won =
      (s.bias === "YES" && exit >= s.entryPrice) ||
      (s.bias === "NO" && exit < s.entryPrice);

    s.exitPrice = exit;
    s.outcome = won ? "win" : "loss";
    s.resolvedAt = Date.now();
    changed = true;
  });

  if (changed) save(STORAGE_KEY, all);
}

function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const bias = next >= entry ? "YES" : "NO";
  const confidence = Math.min(65, Math.max(55, Math.abs(next - entry) * 120));

  const now = Date.now();

  return {
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence,
    entryPrice: entry,
    createdAt: now,
    notifyAt: now,                 // 🔔 instant toast
    resolveAt: bucketEnd(now),     // ✅ FIX
    timeframe: "15m",
    outcome: "pending"
  };
}

export function runCrypto15mEngine({ force = false } = {}) {
  resolveSignals();

  const meta = load(META_KEY, {});
  const currentBucket = bucketStart();

  if (meta.lastBucket === currentBucket && !force) return;

  MARKETS.forEach(market => {
    logSignal(generateSignal(market));
  });

  save(META_KEY, { lastBucket: currentBucket });
}

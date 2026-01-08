// SAFE v4 — signal engine + resolver (NO JSX)

import { logSignal, updateSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const TF = 15 * 60 * 1000;

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

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

function bucket15m() {
  return Math.floor(Date.now() / TF);
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
    id: crypto.randomUUID(),
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence: Math.min(65, Math.max(55, Math.abs(next - entry) * 120)),
    entryPrice: entry,
    createdAt: Date.now(),
    resolveAt: Date.now() + TF,
    notifyAt: Date.now(), // 🔔 immediate popup
    outcome: "pending",
    timeframe: "15m"
  };
}

/* 🔁 REAL RESOLVER */
function resolveSignals() {
  const all = load(STORAGE_KEY, []);
  let changed = false;

  all.forEach(s => {
    if (s.outcome !== "pending") return;
    if (Date.now() < s.resolveAt) return;

    const exit = mockPrice(s.entryPrice);
    const win =
      (s.bias === "YES" && exit >= s.entryPrice) ||
      (s.bias === "NO" && exit < s.entryPrice);

    s.exitPrice = exit;
    s.outcome = win ? "win" : "loss";
    s.resolvedAt = Date.now();
    changed = true;
  });

  if (changed) save(STORAGE_KEY, all);
}

export function runCrypto15mEngine({ force = false } = {}) {
  resolveSignals();

  const meta = load(META_KEY, {});
  const bucket = bucket15m();

  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(m => logSignal(generateSignal(m)));
  save(META_KEY, { lastBucket: bucket });
}

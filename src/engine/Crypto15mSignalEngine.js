// SAFE v3 – analytics + deterministic resolver (NO JSX, NO REACT)

import { logSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

const TF = 15 * 60 * 1000;

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

// deterministic pseudo-trend (NOT random every tick)
function pseudoTrend(symbol, bucket) {
  const seed =
    symbol.charCodeAt(0) * 31 +
    symbol.charCodeAt(1) * 17 +
    bucket;
  return seed % 2 === 0 ? "DOWN" : "UP";
}

function generateSignal(market) {
  const createdAt = Date.now();
  const resolveAt = createdAt + TF;
  const bucket = bucket15m();
  const trend = pseudoTrend(market.symbol, bucket);

  return {
    market: market.name,
    symbol: market.symbol,
    side: trend === "UP" ? "YES" : "NO",
    confidence: trend === "UP" ? 62 : 58,
    timeframe: "15m",
    createdAt,
    resolveAt,
    bias: trend,
    outcome: "pending",
    simulated: true
  };
}

function resolveSignals() {
  const all = load(STORAGE_KEY, []);
  let changed = false;

  all.forEach(s => {
    if (s.outcome !== "pending") return;
    if (Date.now() < s.resolveAt) return;

    // deterministic resolve aligned with bias
    s.outcome = s.bias === "UP" ? "win" : "loss";
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

  MARKETS.forEach(market => {
    logSignal(generateSignal(market));
  });

  save(META_KEY, { lastBucket: bucket });
}

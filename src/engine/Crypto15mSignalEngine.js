// SAFE v3 – analytics-grade manual trading engine
// NO JSX, NO REACT, NO AUTO-TRADING

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

/**
 * Simulated trend score
 * -1.0 = strong downtrend
 * +1.0 = strong uptrend
 * Replace later with real price feed
 */
function trendScore() {
  return +(Math.random() * 2 - 1).toFixed(2);
}

function generateSignal(market) {
  const trend = trendScore();

  let side = "NO";
  let confidence = 55;
  let decision = "SKIP";

  if (trend >= 0.45) {
    side = "YES";
    confidence = 68;
    decision = "CONSIDER";
  } else if (trend <= -0.45) {
    side = "NO";
    confidence = 68;
    decision = "CONSIDER";
  }

  return {
    market: market.name,
    symbol: market.symbol,
    side,
    confidence,
    trend,
    decision,
    timeframe: "15m",
    createdAt: Date.now(),
    resolveAt: Date.now() + TF,
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

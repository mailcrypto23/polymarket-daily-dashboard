// SAFE v6 – real-price 15m signal engine with confidence math

import { logSignal } from "./signalLogger";
import { getLivePrice } from "./priceFeed";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";
const TF = 15 * 60 * 1000;

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" }
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

function calcConfidence(entry, current, bias) {
  const diff = current - entry;
  const pct = Math.abs(diff / entry) * 100;

  let base = 50;
  let momentum = Math.min(25, pct * 4); // momentum weight

  const correctSide =
    (bias === "YES" && diff > 0) ||
    (bias === "NO" && diff < 0);

  let confidence = base + (correctSide ? momentum : -momentum / 2);
  confidence = Math.max(50, Math.min(85, confidence));

  return {
    confidence: Math.round(confidence),
    reason: correctSide
      ? `Price moving ${bias === "YES" ? "up" : "down"} with momentum`
      : "Weak or reversing momentum"
  };
}

async function generateSignal(market) {
  const now = Date.now();
  const entryPrice = await getLivePrice(market.symbol);

  // small delay to detect momentum
  await new Promise(r => setTimeout(r, 1200));
  const currentPrice = await getLivePrice(market.symbol);

  const bias = currentPrice >= entryPrice ? "YES" : "NO";
  const conf = calcConfidence(entryPrice, currentPrice, bias);

  return {
    id: crypto.randomUUID(),
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence: conf.confidence,
    confidenceReason: conf.reason,
    entryPrice,
    currentPrice,
    createdAt: now,
    resolveAt: now + TF,
    timeframe: "15m",
    outcome: "pending",
    notified: false
  };
}

export async function runCrypto15mEngine({ force = false } = {}) {
  const meta = load(META_KEY, {});
  const bucket = bucket15m();

  if (meta.lastBucket === bucket && !force) return;

  for (const market of MARKETS) {
    const signal = await generateSignal(market);
    logSignal(signal);
  }

  save(META_KEY, { lastBucket: bucket });
}

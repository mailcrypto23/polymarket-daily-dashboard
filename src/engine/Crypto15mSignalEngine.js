import { logSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

const INTERVAL_MS = 15 * 60 * 1000;

function bucket15m() {
  return Math.floor(Date.now() / INTERVAL_MS);
}

function loadMeta() {
  return JSON.parse(localStorage.getItem(META_KEY) || "{}");
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function mockPrice(base) {
  return +(base * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2);
}

/**
 * DEMO momentum proxy
 * (NOT a trading signal)
 */
function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const delta = next - entry;
  const confidence = Math.min(
    75,
    Math.max(52, Math.abs(delta) * 100)
  );

  return {
    market: market.name,
    symbol: market.symbol,
    side: delta >= 0 ? "YES" : "NO",
    confidence: Number(confidence.toFixed(1)),
    entryPrice: entry,
    createdAt: Date.now(),
    resolveAt: Date.now() + INTERVAL_MS,
    outcome: "pending",
    source: "crypto-15m-demo-engine"
  };
}

export function runCrypto15mEngine({ force = false } = {}) {
  const bucket = bucket15m();
  const meta = loadMeta();

  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(market => {
    logSignal(generateSignal(market));
  });

  saveMeta({ lastBucket: bucket });
}

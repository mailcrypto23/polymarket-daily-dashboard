import { logSignal, resolveSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const ENGINE_META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6;
  return +(base * (1 + drift / 100)).toFixed(2);
}

function current15mBucket() {
  return Math.floor(Date.now() / (15 * 60 * 1000));
}

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

function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const momentum = next - entry;
  const confidence = Math.min(85, Math.max(55, Math.abs(momentum) * 120));

  return {
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence.toFixed(1)),
    price: entry
  };
}

export function runCrypto15mEngine({ force = false } = {}) {
  const bucket = current15mBucket();
  const signals = loadSignals();
  const meta = loadMeta();

  // Resolve expired
  signals.forEach(s => {
    if (s.outcome === "pending" && Date.now() >= s.resolveAt) {
      resolveSignal(s.id, mockPrice(s.entryPrice));
    }
  });

  if (!force && meta.lastBucket === bucket) return;

  MARKETS.forEach(market => {
    const s = generateSignal(market);
    logSignal({
      market: s.market,
      side: s.side,
      confidence: s.confidence,
      price: s.price,
      timeframe: "15m",
      bucket,
      source: "crypto-15m-engine-v1"
    });
  });

  saveMeta({ lastBucket: bucket });
}

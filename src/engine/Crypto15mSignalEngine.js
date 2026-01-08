// SAFE v4 – analytics + notifier engine (NO JSX, NO REACT)

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

// ──────────────────────────────
// helpers
// ──────────────────────────────
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

// ──────────────────────────────
// signal generator
// ──────────────────────────────
function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const bias = next >= entry ? "YES" : "NO";
  const confidence = Math.min(
    65,
    Math.max(55, Math.abs(next - entry) * 120)
  );

  const now = Date.now();

  return {
    market: market.name,
    symbol: market.symbol,
    bias,
    confidence,

    timeframe: "15m",

    createdAt: now,
    resolveAt: now + TF,

    // ✅ CRITICAL FIX:
    // Fire popup + toast immediately when signal is generated
    notifyAt: now,

    outcome: "pending"
  };
}

// ──────────────────────────────
// engine runner
// ──────────────────────────────
export function runCrypto15mEngine({ force = false } = {}) {
  const meta = load(META_KEY, {});
  const bucket = bucket15m();

  // prevent duplicate signals in same 15m candle
  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(market => {
    logSignal(generateSignal(market));
  });

  save(META_KEY, { lastBucket: bucket });
}

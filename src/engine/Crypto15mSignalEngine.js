// SAFE v2 – analytics + resolver (NO JSX, NO REACT)
// Purpose: generate + auto-resolve 15m crypto signals for MANUAL trading

import { logSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

const TF = 15 * 60 * 1000; // 15 minutes in ms
const ENGINE_VERSION = "crypto-15m-v2";

// ---------------- utils ----------------

function bucket15m(ts) {
  return Math.floor(ts / TF);
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
  // realistic micro-move, avoids wild jumps
  return +(base * (1 + (Math.random() - 0.5) * 0.004)).toFixed(2);
}

// ---------------- signal logic ----------------

function generateSignal(market, now) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  const rawMove = Math.abs(next - entry) * 120;

  return {
    engine: ENGINE_VERSION,
    market: market.name,
    symbol: market.symbol,

    side: next >= entry ? "YES" : "NO",

    // confidence deliberately conservative
    confidence: Math.round(
      Math.min(72, Math.max(55, rawMove))
    ),

    entryPrice: entry,
    timeframe: "15m",

    createdAt: now,
    resolveAt: now + TF,
    bucket: bucket15m(now),

    outcome: "pending"
  };
}

function resolveSignals(now) {
  const all = load(STORAGE_KEY, []);
  let changed = false;

  for (const s of all) {
    if (s.outcome !== "pending") continue;
    if (!s.resolveAt || now < s.resolveAt) continue;

    const exit = mockPrice(s.entryPrice);

    const won =
      (s.side === "YES" && exit >= s.entryPrice) ||
      (s.side === "NO" && exit < s.entryPrice);

    s.exitPrice = exit;
    s.outcome = won ? "win" : "loss";
    s.resolvedAt = now;

    changed = true;
  }

  if (changed) save(STORAGE_KEY, all);
}

// ---------------- engine runner ----------------

export function runCrypto15mEngine({ force = false } = {}) {
  const now = Date.now();

  // 1️⃣ Always resolve first
  resolveSignals(now);

  const meta = load(META_KEY, {});
  const bucket = bucket15m(now);

  // 2️⃣ Prevent duplicate signals per 15m window
  if (meta.lastBucket === bucket && !force) return;

  // 3️⃣ Generate one signal per market
  for (const market of MARKETS) {
    logSignal(generateSignal(market, now));
  }

  // 4️⃣ Save meta
  save(META_KEY, {
    lastBucket: bucket,
    lastRunAt: now,
    engine: ENGINE_VERSION
  });
}

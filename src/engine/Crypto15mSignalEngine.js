// SAFE v2 – analytics only (NO JSX, NO REACT)

import { logSignal } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";
const META_KEY = "pm_engine_meta";

const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

const WINDOW_MS = 15 * 60 * 1000;

// ---------- helpers ----------
function bucket15m() {
  return Math.floor(Date.now() / WINDOW_MS);
}

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

function loadMeta() {
  return JSON.parse(localStorage.getItem(META_KEY) || "{}");
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function mockPrice(base) {
  return +(base * (1 + (Math.random() - 0.5) * 0.006)).toFixed(2);
}

// ---------- signal generation ----------
function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const entry = mockPrice(base);
  const next = mockPrice(entry);

  return {
    market: market.name,
    symbol: market.symbol,
    side: next >= entry ? "YES" : "NO",
    confidence: Math.min(
      90,
      Math.max(55, Math.abs(next - entry) * 120)
    ),
    entryPrice: entry,
    timeframe: "15m",
    source: "crypto-15m-engine",
    outcome: "pending",
    createdAt: Date.now(),
    resolveAt: Date.now() + WINDOW_MS
  };
}

// ---------- auto resolve ----------
function resolveExpiredSignals() {
  const signals = loadSignals();
  const now = Date.now();
  let changed = false;

  signals.forEach(s => {
    if (s.outcome === "pending" && now >= s.resolveAt) {
      const finalMove = Math.random() > 0.5 ? "YES" : "NO";
      s.outcome = finalMove === s.side ? "win" : "loss";
      s.resolvedAt = now;
      changed = true;
    }
  });

  if (changed) saveSignals(signals);
}

// ---------- engine ----------
export function runCrypto15mEngine({ force = false } = {}) {
  resolveExpiredSignals();

  const bucket = bucket15m();
  const meta = loadMeta();

  if (meta.lastBucket === bucket && !force) return;

  MARKETS.forEach(market => {
    logSignal({
      ...generateSignal(market),
      bucket
    });
  });

  saveMeta({ lastBucket: bucket });
}

// src/engine/Crypto15mSignalEngine.js
// FINAL – Polymarket-style 15m signal engine
// Guarantees exactly ONE visible pending signal with SAFE window

const STORAGE_KEY = "pm_signal_history";
const FIFTEEN_MIN = 15 * 60 * 1000;

// % of window considered SAFE (first 40%)
const SAFE_WINDOW_RATIO = 0.4;

// simple deterministic markets rotation
const MARKETS = [
  { symbol: "BTC", name: "Bitcoin", bias: "UP" },
  { symbol: "ETH", name: "Ethereum", bias: "UP" },
  { symbol: "SOL", name: "Solana", bias: "DOWN" },
];

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

function now() {
  return Date.now();
}

function hasActivePending(signals) {
  return signals.some(
    s =>
      s.outcome === "pending" &&
      typeof s.resolveAt === "number" &&
      s.resolveAt > now()
  );
}

function createSignal(index) {
  const market = MARKETS[index % MARKETS.length];
  const createdAt = now();
  const resolveAt = createdAt + FIFTEEN_MIN;
  const safeUntil = createdAt + FIFTEEN_MIN * SAFE_WINDOW_RATIO;

  return {
    id: `sig_${createdAt}`,
    symbol: market.symbol,
    market: `${market.name} Up or Down – 15m`,
    bias: market.bias,
    confidence: 55 + (index % 20), // deterministic but realistic
    createdAt,
    resolveAt,
    safeUntil,

    // trade lifecycle
    entryPrice: null,
    exitPrice: null,
    userDecision: null, // ENTER / SKIP
    outcome: "pending", // pending → WIN / LOSS

    proof: null,
  };
}

/**
 * MAIN ENGINE ENTRY
 * This must be SAFE to call repeatedly
 */
export function runCrypto15mEngine() {
  if (typeof window === "undefined") return;

  const signals = loadSignals();

  // 1️⃣ If a valid pending signal exists → do NOTHING
  if (hasActivePending(signals)) {
    return;
  }

  // 2️⃣ Otherwise, create EXACTLY ONE new signal
  const newSignal = createSignal(signals.length);

  signals.push(newSignal);
  saveSignals(signals);

  // helpful debug (safe in prod)
  console.info(
    "[15m-engine] New signal created:",
    newSignal.symbol,
    "resolves at",
    new Date(newSignal.resolveAt).toLocaleTimeString()
  );
}

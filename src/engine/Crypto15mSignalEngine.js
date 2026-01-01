// src/engine/Crypto15mSignalEngine.js
// SAFE v1 – analytics only

const STORAGE_KEY = "pm_signal_log";

// 4 fixed crypto markets (15m)
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

// ====== DATA MODE ======
// SAFE default = mock
// switch to "real" later
const DATA_MODE = "mock"; // "mock" | "real"

// ====== MOCK PRICE (SAFE) ======
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// ====== STORAGE ======
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

// ====== SIGNAL GENERATION ======
function generateSignal(market) {
  const basePrice = 100 + Math.random() * 50;
  const prev = mockPrice(basePrice);
  const now = mockPrice(prev);

  const momentum = now - prev;

  const confidence = Math.min(
    85,
    Math.max(55, Math.abs(momentum) * 120)
  ).toFixed(1);

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    market: market.name,
    symbol: market.symbol,
    timeframe: "15m",
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence),
    source: "crypto-15m-momentum-v1",
    entryPrice: prev,
    resolvePrice: null,
    outcome: null,
    resolveAt: Date.now() + 15 * 60 * 1000
  };
}

// ====== RESOLUTION ======
function resolveSignals(signals) {
  const now = Date.now();

  return signals.map(s => {
    if (s.outcome) return s;
    if (now < s.resolveAt) return s;

    const finalPrice = mockPrice(s.entryPrice);
    const win =
      (finalPrice > s.entryPrice && s.side === "YES") ||
      (finalPrice < s.entryPrice && s.side === "NO");

    return {
      ...s,
      resolvePrice: finalPrice,
      outcome: win ? "win" : "loss"
    };
  });
}

// ====== ENGINE TICK ======
export function runCrypto15mEngine() {
  let signals = loadSignals();

  // resolve old signals
  signals = resolveSignals(signals);

  // prevent duplicates in same 15m window
  const activeSymbols = signals
    .filter(s => !s.outcome && Date.now() - s.timestamp < 15 * 60 * 1000)
    .map(s => s.symbol);

  MARKETS.forEach(market => {
    if (!activeSymbols.includes(market.symbol)) {
      signals.push(generateSignal(market));
    }
  });

  saveSignals(signals);
}

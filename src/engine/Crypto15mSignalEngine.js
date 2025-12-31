// src/engine/Crypto15mSignalEngine.js

const STORAGE_KEY = "pm_signal_log";

// 4 fixed crypto markets
const MARKETS = [
  { symbol: "BTC", name: "Bitcoin 15m" },
  { symbol: "ETH", name: "Ethereum 15m" },
  { symbol: "SOL", name: "Solana 15m" },
  { symbol: "XRP", name: "XRP 15m" }
];

// mock price generator (SAFE v1)
function mockPrice(base) {
  const drift = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + drift / 100)).toFixed(2);
}

// load history
function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// save history
function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

// generate signal
function generateSignal(market) {
  const basePrice = 100 + Math.random() * 50;
  const prev = mockPrice(basePrice);
  const now = mockPrice(prev);

  const momentum = now - prev;
  const confidence = Math.min(
    75,
    Math.max(55, Math.abs(momentum) * 120)
  ).toFixed(1);

  return {
    timestamp: Date.now(),
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence),
    source: "15m-momentum-v1",
    entryPrice: prev,
    resolvePrice: null,
    outcome: null,
    resolveAt: Date.now() + 15 * 60 * 1000
  };
}

// resolve old signals
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

// main engine tick
export function runCrypto15mEngine() {
  let signals = loadSignals();

  // resolve old ones
  signals = resolveSignals(signals);

  // avoid duplicate signals within same window
  const activeSymbols = signals.filter(
    s => !s.outcome && Date.now() - s.timestamp < 15 * 60 * 1000
  ).map(s => s.symbol);

  MARKETS.forEach(market => {
    if (!activeSymbols.includes(market.symbol)) {
      signals.push(generateSignal(market));
    }
  });

  saveSignals(signals);
}

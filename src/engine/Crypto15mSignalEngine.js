// src/engine/Crypto15mSignalEngine.js
// SAFE v1 – analytics only (no execution, no APIs)

import { logSignal, resolveSignal } from "./signalLogger";

/**
 * CONFIG
 */
const STORAGE_KEY_LAST_RUN = "pm_last_15m_run";
const RESOLUTION_DELAY_MS = 15 * 60 * 1000;

// DEV MODE
// true  = always generate signals (for UI / CSV / PnL testing)
// false = strict 15-minute windows only (realistic mode)
const DEV_FORCE_SIGNAL = true;

/**
 * MARKETS
 */
const MARKETS = [
  { symbol: "BTC", name: "BTC Up or Down – 15 minute" },
  { symbol: "ETH", name: "ETH Up or Down – 15 minute" },
  { symbol: "SOL", name: "SOL Up or Down – 15 minute" },
  { symbol: "XRP", name: "XRP Up or Down – 15 minute" }
];

/**
 * MOCK PRICE GENERATOR (SAFE)
 */
function mockPrice(base) {
  const driftPct = (Math.random() - 0.5) * 0.6; // ±0.3%
  return +(base * (1 + driftPct / 100)).toFixed(2);
}

/**
 * SIGNAL LOGIC
 */
function generateSignal(market) {
  const base = 100 + Math.random() * 50;
  const prev = mockPrice(base);
  const now = mockPrice(prev);

  const momentum = now - prev;

  const confidence = Math.min(
    90,
    Math.max(55, Math.abs(momentum) * 120)
  );

  return {
    market: market.name,
    symbol: market.symbol,
    side: momentum >= 0 ? "YES" : "NO",
    confidence: Number(confidence.toFixed(1)),
    entryPrice: prev
  };
}

/**
 * 15-MINUTE WINDOW CHECK
 */
function isNew15mWindow() {
  const now = Date.now();
  const lastRun = Number(localStorage.getItem(STORAGE_KEY_LAST_RUN) || 0);

  const currentWindow = Math.floor(now / RESOLUTION_DELAY_MS);
  const lastWindow = Math.floor(lastRun / RESOLUTION_DELAY_MS);

  if (currentWindow > lastWindow) {
    localStorage.setItem(STORAGE_KEY_LAST_RUN, now.toString());
    return true;
  }

  return false;
}

/**
 * ENGINE ENTRY
 */
export function runCrypto15mEngine() {
  // Strict timing unless DEV override is enabled
  if (!DEV_FORCE_SIGNAL && !isNew15mWindow()) {
    return;
  }

  MARKETS.forEach(market => {
    const signalData = generateSignal(market);

    // 1️⃣ LOG SIGNAL (pending)
    const signal = logSignal({
      market: signalData.market,
      side: signalData.side,
      confidence: signalData.confidence,
      price: signalData.entryPrice,
      source: "crypto-15m-momentum-v1"
    });

    // 2️⃣ AUTO-RESOLVE AFTER 15 MINUTES
    setTimeout(() => {
      const resolvePrice = mockPrice(signalData.entryPrice);
      resolveSignal(signal.id, resolvePrice);
    }, RESOLUTION_DELAY_MS);
  });
}

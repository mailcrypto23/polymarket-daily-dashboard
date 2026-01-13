/* =========================================================
   Unified Live Price Feed
   - WebSocket first (Binance)
   - REST fallback
========================================================= */

import { startBinanceWsFeed, getWsPrice } from "./binanceWsFeed";

const CACHE = {};
const TTL = 5_000;

const SYMBOL_MAP = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  SOL: "SOLUSDT",
  XRP: "XRPUSDT",
};

// start WS immediately (browser-safe)
if (typeof window !== "undefined") {
  startBinanceWsFeed();
}

export async function getLivePrice(symbol) {
  // 1️⃣ Try WebSocket price
  const wsPrice = getWsPrice(symbol);
  if (typeof wsPrice === "number") return wsPrice;

  const pair = SYMBOL_MAP[symbol];
  if (!pair) return null;

  const now = Date.now();

  // 2️⃣ REST cache
  if (CACHE[pair] && now - CACHE[pair].ts < TTL) {
    return CACHE[pair].price;
  }

  // 3️⃣ REST fallback
  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
    );
    const data = await res.json();
    const price = Number(data.price);

    if (!Number.isFinite(price)) return null;

    CACHE[pair] = { price, ts: now };
    return price;
  } catch {
    return null;
  }
}

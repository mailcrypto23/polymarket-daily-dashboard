/* =========================================================
   Live Price Feed (FINAL)
   - WebSocket first
   - REST fallback
   - XRP-safe
========================================================= */

import { startBinancePriceFeed, getWsPrice } from "./binanceWsFeed";

startBinancePriceFeed();

const CACHE = {};
const IN_FLIGHT = {};
const TTL = 5_000;

const SYMBOL_MAP = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  SOL: "SOLUSDT",
  XRP: "XRPUSDT",
};

export async function getLivePrice(symbol) {
  // 1️⃣ WebSocket first
  const wsPrice = getWsPrice(symbol);
  if (Number.isFinite(wsPrice)) return wsPrice;

  // 2️⃣ REST fallback
  const pair = SYMBOL_MAP[symbol];
  if (!pair) return null;

  const now = Date.now();

  if (CACHE[pair] && now - CACHE[pair].ts < TTL) {
    return CACHE[pair].price;
  }

  if (IN_FLIGHT[pair]) {
    return IN_FLIGHT[pair];
  }

  IN_FLIGHT[pair] = fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
  )
    .then(r => r.json())
    .then(data => {
      const price = Number(data.price);
      if (!Number.isFinite(price)) throw new Error("Invalid price");

      CACHE[pair] = { price, ts: Date.now() };
      delete IN_FLIGHT[pair];
      return price;
    })
    .catch(err => {
      console.error("[priceFeed]", pair, err.message);
      delete IN_FLIGHT[pair];
      return null;
    });

  return IN_FLIGHT[pair];
}

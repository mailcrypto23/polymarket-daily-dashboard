/* =========================================================
   Polymarket Market Resolver (Read-Only)
========================================================= */

const MARKET_CACHE = {};
const TTL = 5 * 60 * 1000;

export async function resolveMarketId(symbol, timeframe) {
  const key = `${symbol}-${timeframe}`;
  const now = Date.now();

  if (MARKET_CACHE[key] && now - MARKET_CACHE[key].ts < TTL) {
    return MARKET_CACHE[key].id;
  }

  const res = await fetch(
    `https://api.polymarket.com/markets?search=${symbol}`
  );

  const data = await res.json();

  const market = data?.markets?.find(m =>
    m.title?.toLowerCase().includes("up or down") &&
    m.title?.includes("15")
  );

  if (!market) return null;

  MARKET_CACHE[key] = { id: market.id, ts: now };
  return market.id;
}

/* =========================================================
   Polymarket Odds Feed (READ-ONLY)
========================================================= */

const CACHE = {};
const TTL = 15_000; // 15 seconds

const MARKET_MAP = {
  BTC: "bitcoin-up-or-down-15m",
  ETH: "ethereum-up-or-down-15m",
  SOL: "solana-up-or-down-15m",
  XRP: "xrp-up-or-down-15m",
};

export async function getPolymarketOdds(symbol) {
  const now = Date.now();
  if (CACHE[symbol] && now - CACHE[symbol].ts < TTL) {
    return CACHE[symbol].data;
  }

  const slug = MARKET_MAP[symbol];
  if (!slug) return null;

  const res = await fetch(
    `https://polymarket.com/api/markets?slug=${slug}`
  );

  if (!res.ok) return null;

  const json = await res.json();
  const market = json?.markets?.[0];
  if (!market) return null;

  const yesPrice = Number(market.yesPrice);
  const noPrice = Number(market.noPrice);

  if (!yesPrice || !noPrice) return null;

  const data = {
    yesPrice,
    noPrice,
    marketProb: yesPrice / 100,
    liquidity: Number(market.liquidity) || null,
    updatedAt: now,
  };

  CACHE[symbol] = { data, ts: now };
  return data;
}

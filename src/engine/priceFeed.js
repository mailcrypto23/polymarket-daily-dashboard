// Live price feed using CoinGecko (no API key required)

const CACHE = {};
const TTL = 10_000; // 10 seconds

export async function getLivePrice(symbol) {
  const now = Date.now();
  if (CACHE[symbol] && now - CACHE[symbol].ts < TTL) {
    return CACHE[symbol].price;
  }

  const idMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    XRP: "ripple"
  };

  const id = idMap[symbol];
  if (!id) throw new Error("Unsupported symbol");

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
  );
  const data = await res.json();

  const price = data[id].usd;
  CACHE[symbol] = { price, ts: now };
  return price;
}

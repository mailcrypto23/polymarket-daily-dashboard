const CACHE = {};
const TTL = 10_000;
const IN_FLIGHT = {};

export async function getLivePrice(symbol) {
  const now = Date.now();

  if (CACHE[symbol] && now - CACHE[symbol].ts < TTL) {
    return CACHE[symbol].price;
  }

  if (IN_FLIGHT[symbol]) {
    return IN_FLIGHT[symbol];
  }

  const idMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    XRP: "ripple"
  };

  const id = idMap[symbol];
  if (!id) throw new Error("Unsupported symbol");

  IN_FLIGHT[symbol] = fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
  )
    .then(r => r.json())
    .then(data => {
      const price = data[id].usd;
      CACHE[symbol] = { price, ts: now };
      delete IN_FLIGHT[symbol];
      return price;
    })
    .catch(err => {
      delete IN_FLIGHT[symbol];
      throw err;
    });

  return IN_FLIGHT[symbol];
}

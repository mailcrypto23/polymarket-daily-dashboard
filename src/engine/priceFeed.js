/* =========================================================
   Live Price Feed — Binance REST (FINAL)
   - Fixes XRP permanently
   - Unified source for BTC / ETH / SOL / XRP
   - Caching + in-flight deduplication
   - No rate-limit surprises
========================================================= */

const CACHE = {};
const IN_FLIGHT = {};
const TTL = 5_000; // 5 seconds

const SYMBOL_MAP = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  SOL: "SOLUSDT",
  XRP: "XRPUSDT",
};

export async function getLivePrice(symbol) {
  const pair = SYMBOL_MAP[symbol];
  if (!pair) {
    console.warn("[priceFeed] Unsupported symbol:", symbol);
    return null;
  }

  const now = Date.now();

  // Serve cached price
  if (CACHE[pair] && now - CACHE[pair].ts < TTL) {
    return CACHE[pair].price;
  }

  // Deduplicate in-flight requests
  if (IN_FLIGHT[pair]) {
    return IN_FLIGHT[pair];
  }

  IN_FLIGHT[pair] = fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
  )
    .then(res => {
      if (!res.ok) throw new Error("Binance fetch failed");
      return res.json();
    })
    .then(data => {
      const price = Number(data.price);
      if (!Number.isFinite(price)) {
        throw new Error("Invalid price");
      }

      CACHE[pair] = { price, ts: Date.now() };
      delete IN_FLIGHT[pair];
      return price;
    })
    .catch(err => {
      console.error("[priceFeed] error:", pair, err.message);
      delete IN_FLIGHT[pair];
      return null;
    });

  return IN_FLIGHT[pair];
}

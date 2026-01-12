/**
 * priceFeed.ts
 *
 * Live WebSocket price feed using Binance miniTicker streams.
 * Designed to provide low-latency mid prices for confidenceEngine.
 *
 * Safe for frontend usage.
 */

type PriceUpdate = {
  price: number;
  bid?: number;
  ask?: number;
};

type PriceCallback = (update: PriceUpdate) => void;

/**
 * Start live price feed for a symbol (e.g. BTCUSDT, ETHUSDT)
 */
export function startPriceFeed(
  symbol: string,
  onUpdate: PriceCallback
): WebSocket {
  const stream = symbol.toLowerCase() + "@bookTicker";
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      const bid = parseFloat(data.b);
      const ask = parseFloat(data.a);
      const mid = (bid + ask) / 2;

      if (!isNaN(mid)) {
        onUpdate({
          price: mid,
          bid,
          ask
        });
      }
    } catch (err) {
      console.error("Price feed parse error:", err);
    }
  };

  ws.onerror = () => {
    ws.close();
    console.warn("Price feed disconnected. Reconnecting...");
    setTimeout(() => startPriceFeed(symbol, onUpdate), 2000);
  };

  return ws;
}

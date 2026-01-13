/* =========================================================
   Binance WebSocket Price Feed
   - Sub-second price updates
   - Browser-safe
========================================================= */

const SYMBOL_MAP = {
  BTC: "btcusdt",
  ETH: "ethusdt",
  SOL: "solusdt",
  XRP: "xrpusdt",
};

const prices = {};
let socket = null;
let lastMessageAt = 0;

export function startBinanceWsFeed() {
  if (socket || typeof window === "undefined") return;

  const streams = Object.values(SYMBOL_MAP)
    .map(s => `${s}@trade`)
    .join("/");

  socket = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${streams}`
  );

  socket.onmessage = event => {
    const msg = JSON.parse(event.data);
    const symbol = msg?.data?.s;
    const price = Number(msg?.data?.p);

    if (!symbol || !Number.isFinite(price)) return;

    const asset = Object.keys(SYMBOL_MAP).find(
      k => SYMBOL_MAP[k].toUpperCase() === symbol
    );

    if (asset) {
      prices[asset] = price;
      lastMessageAt = Date.now();
    }
  };

  socket.onclose = () => {
    socket = null;
    setTimeout(startBinanceWsFeed, 3000);
  };

  socket.onerror = () => {
    socket?.close();
  };
}

export function getWsPrice(symbol) {
  return prices[symbol] ?? null;
}

export function getFeedHealth() {
  if (!lastMessageAt) return "DISCONNECTED";
  return Date.now() - lastMessageAt < 3000 ? "LIVE" : "DEGRADED";
}

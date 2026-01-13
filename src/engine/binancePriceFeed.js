/* =========================================================
   Binance WebSocket Price Feed (FINAL)
   - Sub-second updates
   - Auto-reconnect
   - XRP-safe
========================================================= */

const SYMBOL_MAP = {
  BTC: "btcusdt",
  ETH: "ethusdt",
  SOL: "solusdt",
  XRP: "xrpusdt",
};

const prices = {};
let socket = null;

export function startBinancePriceFeed() {
  if (socket) return;

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
      k => SYMBOL_MAP[k].toUpperCase() === symbol.toLowerCase()
    );

    if (asset) {
      prices[asset] = price;
    }
  };

  socket.onerror = err => {
    console.warn("[binance-ws] error", err);
  };

  socket.onclose = () => {
    socket = null;
    setTimeout(startBinancePriceFeed, 3000);
  };
}

export function getWsPrice(symbol) {
  return prices[symbol] ?? null;
}

// src/services/realtime.js
// Minimal websocket + subscription API used by NeonPriceTicker and other components.
// Uses env variable POLY_WS_URL (fallback to wss://example.realtime)

const WS_URL = import.meta.env.VITE_POLY_WS_URL || process.env.POLY_WS_URL || "wss://example.realtime/ws";

let socket = null;
let subscribers = new Map(); // pair -> Set of callbacks

function ensureSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;
  socket = new WebSocket(WS_URL);

  socket.addEventListener("open", () => {
    console.info("Realtime socket open");
    // resubscribe to pairs
    for (const pair of subscribers.keys()) {
      socket.send(JSON.stringify({ type: "subscribe", pair }));
    }
  });

  socket.addEventListener("message", (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      // expected shape: { type: "price", pair: "ETH/USDT", price: 1234.5, ts: 1234567890 }
      if (msg?.type === "price" && msg.pair) {
        const set = subscribers.get(msg.pair);
        if (set) {
          for (const cb of set) {
            try { cb(msg); } catch (e) { console.error(e); }
          }
        }
      }
    } catch (e) {
      console.error("Realtime message parse failed", e);
    }
  });

  socket.addEventListener("close", () => {
    console.info("Realtime socket closed — will reconnect in 2s");
    setTimeout(() => ensureSocket(), 2000);
  });

  socket.addEventListener("error", (e) => {
    console.error("Realtime socket error", e);
    // Let close handler retry
  });
}

export function subscribeToPrice(pair = "ETH/USDT", cb) {
  ensureSocket();
  if (!subscribers.has(pair)) subscribers.set(pair, new Set());
  subscribers.get(pair).add(cb);

  // if connection is open, send subscribe
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "subscribe", pair }));
  }

  // Return unsubscribe function
  return () => {
    const set = subscribers.get(pair);
    if (set) {
      set.delete(cb);
      if (set.size === 0) {
        subscribers.delete(pair);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "unsubscribe", pair }));
        }
      }
    }
  };
}

export function unsubscribeAll() {
  subscribers.clear();
  if (socket && socket.readyState === WebSocket.OPEN) {
    try { socket.close(); } catch (e) {}
    socket = null;
  }
}


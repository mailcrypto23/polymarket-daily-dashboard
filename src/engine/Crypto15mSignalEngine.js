import { logSignal } from "./signalLogger";
import { getLivePrice } from "./priceFeed";

export function runCrypto15mEngine() {
  if (typeof window === "undefined") return;

  const now = Date.now();

  // 🔒 Prevent duplicate signals every refresh
  const last = Number(localStorage.getItem("pm_last_signal_ts") || 0);
  if (now - last < 15 * 60 * 1000) return;

  localStorage.setItem("pm_last_signal_ts", now);

  const symbols = ["BTC", "ETH", "SOL", "XRP"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const entryPrice = getLivePrice(symbol);
  if (typeof entryPrice !== "number") return;

  const confidence = Math.floor(55 + Math.random() * 30); // 55–85
  const bias = Math.random() > 0.5 ? "UP" : "DOWN";

  const signal = {
    id: crypto.randomUUID(),
    symbol,
    timeframe: "15m",
    bias,
    confidence,

    entryPrice,
    exitPrice: null,

    createdAt: now,
    resolveAt: now + 15 * 60 * 1000,

    userDecision: null,       // 👈 REQUIRED
    outcome: "pending",       // 👈 REQUIRED

    proof: null
  };

  logSignal(signal);
}

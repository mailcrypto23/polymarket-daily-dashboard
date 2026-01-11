// src/engine/seedSignals.js

export const SEED_SIGNALS = Array.from({ length: 24 }).map((_, i) => {
  const confidence = 0.62 + Math.random() * 0.23;

  return {
    id: `seed-${i}`,
    symbol: ["BTC", "ETH", "SOL", "XRP"][i % 4],
    timeframe: "15m",
    direction: Math.random() > 0.5 ? "UP" : "DOWN",
    confidence,
    confidenceBreakdown: {
      momentum: Math.round(confidence * 100),
      trend: Math.round(confidence * 100 - 3),
      volatility: Math.round(confidence * 100 - 5),
      liquidity: Math.round(confidence * 100 - 2),
      finalConfidence: Math.round(confidence * 100),
    },
    createdAt: Date.now() - (i + 1) * 15 * 60 * 1000,
    resolveAt: Date.now() - i * 15 * 60 * 1000,
    resolved: true,
    result: Math.random() < confidence ? "WIN" : "LOSS",
  };
});

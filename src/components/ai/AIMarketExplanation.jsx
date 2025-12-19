import React, { useMemo } from "react";

export default function AIMarketExplanation({ market }) {
  const insight = useMemo(() => {
    switch (market) {
      case "ETH":
        return {
          bias: "Bullish",
          confidence: 72,
          summary:
            "Liquidity clusters below current price indicate strong downside support. Orderbook imbalance favors buyers with moderate bid dominance.",
          bullets: [
            "Strong liquidity support near $3,180",
            "Buy-side depth outweighs sell pressure",
            "No major resistance until $3,320",
          ],
          risk:
            "A sudden liquidity drop below $3,150 could invalidate the bullish bias.",
        };

      case "BTC":
        return {
          bias: "Neutral",
          confidence: 55,
          summary:
            "Market shows balanced liquidity with no clear directional dominance. Volatility compression suggests a breakout setup.",
          bullets: [
            "Even bid/ask distribution",
            "Low spread volatility",
            "Potential expansion within 24h",
          ],
          risk:
            "Break below $42,800 may trigger downside momentum.",
        };

      default:
        return {
          bias: "Cautious",
          confidence: 50,
          summary:
            "Insufficient liquidity data to establish a strong directional bias.",
          bullets: [
            "Thin orderbook depth",
            "Low volume participation",
          ],
          risk:
            "Higher slippage risk under market stress.",
        };
    }
  }, [market]);

  return (
    <div className="bg-premiumCard border border-white/5 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h3 className="font-semibold text-base">
            AI Market Insight
          </h3>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            insight.bias === "Bullish"
              ? "bg-green-500/15 text-green-300"
              : insight.bias === "Neutral"
              ? "bg-yellow-500/15 text-yellow-300"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          {insight.bias} · {insight.confidence}%
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm opacity-85 mb-3 leading-relaxed">
        {insight.summary}
      </p>

      {/* Key Signals */}
      <ul className="space-y-1 text-sm mb-3">
        {insight.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-400 mt-[2px]">•</span>
            <span className="opacity-90">{b}</span>
          </li>
        ))}
      </ul>

      {/* Risk */}
      <div className="text-xs opacity-70 border-t border-white/5 pt-2">
        ⚠ Risk: {insight.risk}
      </div>
    </div>
  );
}

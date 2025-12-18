import React from "react";

export default function AIExplanationPanel() {
  return (
    <div className="relative rounded-2xl p-5
                    bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-fuchsia-900/40
                    border border-white/10 backdrop-blur">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <h3 className="text-sm font-semibold tracking-wide text-white">
          AI Market Insight
        </h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full
                         bg-emerald-500/20 text-emerald-300">
          Demo
        </span>
      </div>

      {/* Main Insight */}
      <div className="text-white text-sm font-medium mb-2">
        ETH ETF Approval — <span className="text-emerald-400">High Confidence (96%)</span>
      </div>

      {/* Explanation bullets */}
      <ul className="space-y-1 text-xs text-white/80">
        <li>• YES liquidity outweighs NO by <b>3.2×</b></li>
        <li>• Recent price momentum trending upward</li>
        <li>• Bid–ask spread tightening (low volatility)</li>
        <li>• No whale resistance detected</li>
      </ul>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-white/60 mb-1">
          <span>Confidence Score</span>
          <span>96%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r
                       from-emerald-400 to-green-500"
            style={{ width: "96%" }}
          />
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-3 text-[10px] text-white/50">
        Generated using liquidity, spread, volume & momentum signals
      </div>
    </div>
  );
}

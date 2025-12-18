import React from "react";
import { leaderboardData } from "../../mock-data/leaderboard";

export default function SmartMoneyLeaderboard() {
  return (
    <div
      className="rounded-xl p-4
                 bg-gradient-to-br from-indigo-900/70 to-purple-900/60
                 border border-white/10 backdrop-blur
                 shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          🏆 Smart Money
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full
                         bg-emerald-500/20 text-emerald-300">
          Live
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {leaderboardData.map((row, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between
                       bg-white/5 rounded-lg px-3 py-2
                       hover:bg-white/10 transition"
          >
            <div>
              <div className="text-sm font-medium">
                {row.name}
              </div>
              <div className="text-[11px] opacity-70">
                {row.market}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-emerald-400 font-semibold">
                +${row.pnl.toLocaleString()}
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] opacity-70">
                <span
                  className={`h-2 w-2 rounded-full ${
                    row.confidence === "High"
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                      : "bg-yellow-400"
                  }`}
                />
                {row.confidence}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 text-[10px] text-white/50">
        Liquidity-weighted demo data
      </div>
    </div>
  );
}

import React from "react";

export default function LastTradeCard({ trade }) {
  if (!trade) return null;

  const isBuy = trade.side === "BUY";

  return (
    <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-white/10 rounded-xl p-4 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm opacity-80">Last Trade</div>
        <div className="text-xs opacity-60">
          {new Date(trade.time).toLocaleTimeString()}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold">{trade.pair}</div>
          <div
            className={`text-sm font-medium ${
              isBuy ? "text-green-400" : "text-red-400"
            }`}
          >
            {trade.side}
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold">${trade.price}</div>
          <div className="text-sm opacity-70">{trade.size}</div>
        </div>
      </div>

      <div className="mt-3 text-xs opacity-60">
        Trade ID: {trade.id}
      </div>
    </div>
  );
}

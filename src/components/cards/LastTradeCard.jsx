import React from "react";

export default function LastTradeCard({ trade }) {
  if (!trade) {
    return (
      <div className="bg-premiumCard rounded-xl p-4 opacity-70">
        No recent trades
      </div>
    );
  }

  const isBuy = trade.side === "BUY";

  return (
    <div className="relative overflow-hidden rounded-xl p-5
      bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">

      <div className="flex justify-between items-center mb-2">
        <div className="text-sm opacity-90">
          {new Date(trade.time).toLocaleString()}
        </div>
        <div className="text-lg font-bold">
          #{trade.id}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div>
          <div className="text-xs opacity-80">PAIR</div>
          <div className="text-lg font-semibold">{trade.pair}</div>
        </div>

        <div className="text-right">
          <div className="text-xs opacity-80">PRICE</div>
          <div className="text-lg font-semibold">${trade.price}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div
          className={`font-semibold ${
            isBuy ? "text-green-300" : "text-red-300"
          }`}
        >
          {isBuy ? "BUY" : "SELL"}
        </div>

        <div className="text-sm opacity-90">
          Size: {trade.size}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 text-sm">
          Trade Again
        </button>
        <button className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}

import React from "react";

export default function ChartCard({ trades = [] }) {
  return (
    <div className="rounded-xl bg-[#0b1220] border border-white/5 p-5">
      <div className="text-sm text-gray-400 mb-3">Recent Trades</div>

      {trades.length === 0 && (
        <div className="text-sm text-gray-500">No activity</div>
      )}

      <div className="space-y-2">
        {trades.slice(0, 5).map((t, i) => (
          <div
            key={i}
            className="flex justify-between text-sm"
          >
            <span
              className={
                t.side === "BUY"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {t.side}
            </span>
            <span className="text-white">{t.price}</span>
            <span className="text-gray-500">{t.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



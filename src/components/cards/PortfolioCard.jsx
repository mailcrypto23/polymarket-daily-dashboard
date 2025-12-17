import React from "react";

export default function PortfolioCard({ lastTrade }) {
  if (!lastTrade) {
    return (
      <div className="rounded-xl bg-[#0b1220] border border-white/5 p-5">
        <div className="text-gray-400 text-sm">Last Trade</div>
        <div className="mt-3 text-gray-500 text-sm">No trades yet</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-[1px]">
      <div className="rounded-xl bg-[#0b1220] p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Last Trade</div>
            <div className="text-lg font-semibold text-white">
              {lastTrade.side} · {lastTrade.pair}
            </div>
          </div>
          <div className="text-sm text-white">
            {lastTrade.price}
          </div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>Qty: {lastTrade.qty}</span>
          <span>{lastTrade.time}</span>
        </div>
      </div>
    </div>
  );
}

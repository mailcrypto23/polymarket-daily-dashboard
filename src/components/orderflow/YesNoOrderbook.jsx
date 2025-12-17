import React from "react";

export default function YesNoOrderbook({ market }) {
  if (!market || typeof market !== "object") {
    return (
      <div className="text-sm opacity-60 text-center py-6">
        Select a market to view YES / NO liquidity
      </div>
    );
  }

  const yes = market.yes || [];
  const no = market.no || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-premiumCard p-4 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-3">YES</h3>
        {yes.length === 0 ? (
          <div className="text-xs opacity-60">No liquidity</div>
        ) : (
          yes.map((l, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span>${l.price}</span>
              <span className="opacity-70">{l.liq}</span>
            </div>
          ))
        )}
      </div>

      <div className="bg-premiumCard p-4 rounded-lg">
        <h3 className="text-red-400 font-semibold mb-3">NO</h3>
        {no.length === 0 ? (
          <div className="text-xs opacity-60">No liquidity</div>
        ) : (
          no.map((l, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span>${l.price}</span>
              <span className="opacity-70">{l.liq}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

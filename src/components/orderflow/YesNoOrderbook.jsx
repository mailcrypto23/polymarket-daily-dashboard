import React from "react";

export default function YesNoOrderbook({ market }) {
  if (!market) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* YES SIDE */}
      <div className="bg-premiumCard p-4 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-3">YES</h3>
        {market.yes.map((l, i) => (
          <div key={i} className="flex justify-between text-sm mb-1">
            <span>${l.price}</span>
            <span className="opacity-70">{l.liq}</span>
          </div>
        ))}
      </div>

      {/* NO SIDE */}
      <div className="bg-premiumCard p-4 rounded-lg">
        <h3 className="text-red-400 font-semibold mb-3">NO</h3>
        {market.no.map((l, i) => (
          <div key={i} className="flex justify-between text-sm mb-1">
            <span>${l.price}</span>
            <span className="opacity-70">{l.liq}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

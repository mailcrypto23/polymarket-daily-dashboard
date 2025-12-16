// File: src/pages/Market.jsx
import React from "react";

export default function Market({ markets = [], onSelect }) {
  if (!markets.length) {
    return (
      <div className="p-6 text-sm opacity-70 text-center">
        No market mock-data found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-700 opacity-70">
            <th className="py-2">Pair</th>
            <th>Price</th>
            <th>24h Vol</th>
          </tr>
        </thead>
        <tbody>
          {markets.slice(0, 12).map((m) => (
            <tr
              key={m.id}
              onClick={() => onSelect?.(m)}
              className="cursor-pointer hover:bg-[#0e1726]"
            >
              <td className="py-3 font-medium">{m.pair}</td>
              <td>{m.price}</td>
              <td>{m.volume24h}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

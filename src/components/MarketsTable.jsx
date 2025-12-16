import React from "react";

export default function MarketsTable({ markets = [], onSelect }) {
  if (!markets.length) {
    return (
      <div className="text-sm opacity-70 text-center p-6">
        No market data
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700 text-gray-300">
          <th className="py-2 text-left">Pair</th>
          <th>Price</th>
          <th>24h Vol</th>
        </tr>
      </thead>
      <tbody>
        {markets.map((m) => (
          <tr
            key={m.id}
            onClick={() => onSelect(m)}
            className="hover:bg-[#0e1726] cursor-pointer"
          >
            <td className="py-3 font-medium">{m.pair}</td>
            <td>{m.price}</td>
            <td>{m.volume24h}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

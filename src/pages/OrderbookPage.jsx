// src/pages/OrderbookPage.jsx
import React from "react";

function Column({ title, data }) {
  return (
    <div>
      <div className="text-xs opacity-70 mb-2">{title}</div>
      <div className="space-y-1 text-sm">
        {data.length === 0 && (
          <div className="opacity-50">No data</div>
        )}
        {data.slice(0, 8).map((row, i) => (
          <div key={i} className="flex justify-between">
            <span>{row.price}</span>
            <span className="opacity-60">{row.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderbookPage({ market }) {
  const bids = market?.orderbook?.bids || [];
  const asks = market?.orderbook?.asks || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Column title="Bids" data={bids} />
      <Column title="Asks" data={asks} />
    </div>
  );
}

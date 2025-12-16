// File: src/pages/OrderbookPage.jsx
import React from "react";

function OrderbookList({ title, entries }) {
  if (!entries || entries.length === 0) {
    return <div className="text-sm opacity-60">No data</div>;
  }

  return (
    <div>
      <div className="text-xs opacity-70 mb-2">{title}</div>
      <div className="space-y-1 text-sm">
        {entries.slice(0, 8).map((e, i) => (
          <div key={i} className="flex justify-between">
            <span>{e.price}</span>
            <span className="opacity-70">{e.size}</span>
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
      <OrderbookList title="Bids" entries={bids} />
      <OrderbookList title="Asks" entries={asks} />
    </div>
  );
}

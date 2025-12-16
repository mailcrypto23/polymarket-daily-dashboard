import React from "react";

export default function OrderbookWidget({ market }) {
  if (!market?.orderbook) {
    return <div className="text-sm opacity-70">No orderbook</div>;
  }

  const { bids = [], asks = [] } = market.orderbook;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="opacity-70 mb-2">Bids</h4>
        {bids.slice(0, 6).map((b, i) => (
          <div key={i} className="flex justify-between">
            <span>{b.price}</span>
            <span>{b.size}</span>
          </div>
        ))}
      </div>
      <div>
        <h4 className="opacity-70 mb-2">Asks</h4>
        {asks.slice(0, 6).map((a, i) => (
          <div key={i} className="flex justify-between">
            <span>{a.price}</span>
            <span>{a.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// File: src/pages/OrderbookPage.jsx
import React from "react";

export default function OrderbookPage({ market }) {
  if (!market || !market.orderbook) {
    return (
      <div className="text-sm opacity-70">
        No orderbook data (mock demo)
      </div>
    );
  }

  const { bids = [], asks = [] } = market.orderbook;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* BIDS */}
      <div>
        <div className="mb-2 text-xs opacity-70">Bids</div>
        {bids.length === 0 ? (
          <div className="opacity-60">No bids</div>
        ) : (
          bids.slice(0, 8).map((b, i) => (
            <div key={i} className="flex justify-between">
              <span>{b.price}</span>
              <span className="opacity-70">{b.size}</span>
            </div>
          ))
        )}
      </div>

      {/* ASKS */}
      <div>
        <div className="mb-2 text-xs opacity-70">Asks</div>
        {asks.length === 0 ? (
          <div className="opacity-60">No asks</div>
        ) : (
          asks.slice(0, 8).map((a, i) => (
            <div key={i} className="flex justify-between">
              <span>{a.price}</span>
              <span className="opacity-70">{a.size}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

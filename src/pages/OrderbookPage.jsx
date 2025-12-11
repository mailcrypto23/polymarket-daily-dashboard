// src/pages/OrderbookPage.jsx
import React, { useEffect, useState } from "react";
import { fetchOrderbook } from "../services/orderbook";

export default function OrderbookPage() {
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchOrderbook().then(setBook);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Orderbook</h1>

      {!book ? (
        <div className="opacity-60">Loading mock orderbook…</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* BIDS */}
          <div className="bg-[#172033] p-5 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-green-400">Bids</h3>
            {book.bids.length === 0 ? (
              <div className="opacity-60">No bids</div>
            ) : (
              book.bids.map((b, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 py-2">
                  <span>{b.price}</span>
                  <span>{b.size}</span>
                </div>
              ))
            )}
          </div>

          {/* ASKS */}
          <div className="bg-[#331722] p-5 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-red-400">Asks</h3>
            {book.asks.length === 0 ? (
              <div className="opacity-60">No asks</div>
            ) : (
              book.asks.map((a, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 py-2">
                  <span>{a.price}</span>
                  <span>{a.size}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

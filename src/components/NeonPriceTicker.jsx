import React, { useEffect, useState } from "react";
import { subscribeToPrice } from "../services/realtime";

export default function NeonPriceTicker({
  pair = "ETH/USDT",
  compact = false
}) {
  const [price, setPrice] = useState("--");

  useEffect(() => {
    const unsub = subscribeToPrice(pair, (tick) => {
      if (tick?.price) setPrice(tick.price);
    });
    return unsub;
  }, [pair]);

  return (
    <div
      className={`
        rounded-xl text-white
        ${compact
          ? "px-3 py-2 text-xs bg-gradient-to-br from-indigo-900/60 to-purple-900/40"
          : "px-5 py-4 text-sm bg-gradient-to-br from-indigo-900/70 to-purple-900/50"}
      `}
    >
      <div className="opacity-70 text-[10px]">LIVE</div>
      <div className="font-semibold tracking-wide">
        {pair} — {price}
      </div>
    </div>
  );
}

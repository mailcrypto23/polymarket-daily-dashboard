                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         import React, { useEffect, useState } from "react";

const pairs = ["ETH/USDT", "BTC/USDT", "SOL/USDT"];

export default function SpreadScanner() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const tick = () => {
      setData(
        pairs.map((p) => ({
          pair: p,
          spread: (Math.random() * 0.3).toFixed(2),
        }))
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div
          key={d.pair}
          className="flex justify-between bg-premiumCard px-3 py-2 rounded"
        >
          <span>{d.pair}</span>
          <span className="text-green-400">{d.spread}%</span>
        </div>
      ))}
    </div>
  );
}
const spreads = [
  { pair: "ETH/USDT", spread: "0.12%" },
  { pair: "BTC/USDT", spread: "0.08%" },
  { pair: "SOL/USDT", spread: "0.21%" },
];

export default function SpreadScanner() {
  return (
    <div className="space-y-2">
      {spreads.map((s) => (
        <div
          key={s.pair}
          className="flex justify-between bg-white/5 p-2 rounded"
        >
          <span>{s.pair}</span>
          <span className="text-green-400">{s.spread}</span>
        </div>
      ))}
    </div>
  );
}



import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const genDepth = () =>
  Array.from({ length: 20 }).map((_, i) => ({
    level: i,
    bids: Math.random() * 100,
    asks: Math.random() * 100,
  }));

export default function MarketDepth() {
  const [data, setData] = useState(genDepth());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(genDepth());
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey="bids"
          stroke="#22c55e"
          fill="#22c55e33"
        />
        <Area
          type="monotone"
          dataKey="asks"
          stroke="#ef4444"
          fill="#ef444433"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";

function genDepth() {
  return Array.from({ length: 20 }, (_, i) => ({
    x: i,
    bid: Math.random() * 100 + 50,
    ask: Math.random() * 100 + 50
  }));
}

export default function MarketDepth() {
  const [data, setData] = useState(genDepth());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(genDepth());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey="bid"
          stroke="#22c55e"
          fill="#22c55e33"
        />
        <Area
          type="monotone"
          dataKey="ask"
          stroke="#ef4444"
          fill="#ef444433"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const generatePoint = (last) => {
  const change = (Math.random() - 0.5) * 15;
  return Math.max(100, last + change);
};

export default function LinePriceChart() {
  const [data, setData] = useState(
    Array.from({ length: 30 }).map((_, i) => ({
      time: i,
      price: 3200 + Math.random() * 40,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const lastPrice = prev[prev.length - 1].price;
        const next = generatePoint(lastPrice);

        return [
          ...prev.slice(1),
          { time: prev[prev.length - 1].time + 1, price: next },
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis hide />
        <YAxis hide />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

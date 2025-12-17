import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function generatePoint(prev) {
  const delta = (Math.random() - 0.5) * 4;
  return Math.max(1000, prev + delta);
}

export default function LinePriceChart() {
  const [data, setData] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      t: i,
      price: 3200 + Math.random() * 10
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const next = {
          t: last.t + 1,
          price: generatePoint(last.price)
        };
        return [...prev.slice(1), next];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <XAxis dataKey="t" hide />
        <YAxis domain={["auto", "auto"]} hide />
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

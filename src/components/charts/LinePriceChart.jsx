import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = Array.from({ length: 30 }).map((_, i) => ({
  t: i,
  price: 3100 + Math.sin(i / 3) * 40 + i * 1.2,
}));

export default function LinePriceChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
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
    </div>
  );
}

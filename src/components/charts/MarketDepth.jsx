import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const depth = Array.from({ length: 20 }).map((_, i) => ({
  x: i,
  bids: Math.random() * 100,
  asks: Math.random() * 80,
}));

export default function MarketDepth() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={depth}>
          <Tooltip />
          <Area dataKey="bids" stroke="#22c55e" fill="#22c55e44" />
          <Area dataKey="asks" stroke="#ef4444" fill="#ef444444" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


export default function ConfidenceBars({ breakdown }) {
  if (!breakdown) return null;

  const rows = [
    { label: "Momentum", value: breakdown.momentum },
    { label: "Trend", value: breakdown.trend },
    { label: "Volatility", value: breakdown.volatility },
    { label: "Liquidity", value: breakdown.liquidity },
  ];

  return (
    <div className="mt-3 space-y-2">
      {rows.map(r => (
        <div key={r.label}>
          <div className="flex justify-between text-[11px] mb-1">
            <span>{r.label}</span>
            <span>{r.value}%</span>
          </div>

          <div className="h-2 bg-white/10 rounded overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-700 ease-out"
              style={{ width: `${r.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getPnLSummary } from "../../engine/pnlSummary";

export default function PnLSummary({ minConfidence }) {
  const [summary, setSummary] = useState(getPnLSummary(minConfidence));

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(getPnLSummary(minConfidence));
    }, 2000);

    return () => clearInterval(interval);
  }, [minConfidence]);

  return (
    <div className="grid grid-cols-4 gap-4">
      <Stat label="Signals" value={summary.total} />
      <Stat label="Wins" value={summary.wins} />
      <Stat label="Losses" value={summary.losses} />
      <Stat
        label="Win Rate"
        value={`${summary.winRate}%`}
        highlight={summary.winRate >= 60}
      />
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`p-4 rounded-xl bg-white/5 ${
        highlight ? "ring-2 ring-green-500/50" : ""
      }`}
    >
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

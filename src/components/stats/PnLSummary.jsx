import { useEffect, useState } from "react";
import { getPnLSummary } from "../../engine/pnlSummary";

const EMPTY_SUMMARY = {
  total: 0,
  wins: 0,
  losses: 0,
  winRate: 0
};

export default function PnLSummary({ minConfidence }) {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);

  useEffect(() => {
    let mounted = true;

    const update = () => {
      try {
        const next = getPnLSummary(minConfidence);

        if (mounted && next && typeof next === "object") {
          setSummary({
            total: Number(next.total) || 0,
            wins: Number(next.wins) || 0,
            losses: Number(next.losses) || 0,
            winRate: Number(next.winRate) || 0
          });
        }
      } catch {
        // swallow errors to avoid crashing render
      }
    };

    update();
    const interval = setInterval(update, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
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

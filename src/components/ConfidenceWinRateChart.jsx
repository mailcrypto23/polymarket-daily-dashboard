import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

/**
 * Confidence buckets in %
 */
const BUCKETS = [
  { min: 60, max: 65 },
  { min: 65, max: 70 },
  { min: 70, max: 75 },
  { min: 75, max: 80 },
  { min: 80, max: 85 },
];

export default function ConfidenceWinRateChart() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const compute = () => {
      const resolved = getLastResolvedSignals(200);

      const buckets = BUCKETS.map(b => {
        const signals = resolved.filter(s => {
          const confidencePct = Math.round(s.confidence * 100);
          return confidencePct >= b.min && confidencePct < b.max;
        });

        const wins = signals.filter(
          s => s.result === "WIN"
        ).length;

        return {
          label: `${b.min}–${b.max}%`,
          count: signals.length,
          winRate:
            signals.length > 0
              ? Math.round((wins / signals.length) * 100)
              : null,
        };
      });

      setStats(buckets);
    };

    compute();
    const id = setInterval(compute, 3000); // live updates
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl bg-black/40 border border-white/10 p-5">
      <h3 className="font-semibold mb-4">
        Confidence vs Win Rate
      </h3>

      <div className="space-y-3">
        {stats.map(row => (
          <div key={row.label}>
            <div className="flex justify-between text-xs mb-1">
              <span>{row.label}</span>
              <span>
                {row.winRate !== null
                  ? `${row.winRate}%`
                  : "—"}
              </span>
            </div>

            {/* Bar */}
            <div className="h-2 bg-white/10 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  row.winRate >= 70
                    ? "bg-green-400"
                    : row.winRate >= 60
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{
                  width: row.winRate
                    ? `${row.winRate}%`
                    : "0%",
                }}
              />
            </div>

            <div className="text-[10px] text-white/40 mt-1">
              {row.count} signals
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

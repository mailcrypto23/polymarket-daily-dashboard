import { useEffect, useState } from "react";
import { getResolvedSignals } from "../engine/signalStore";

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    // Pull latest resolved signals (engine-owned data)
    const resolved = getResolvedSignals()
      .slice(-4)            // last 4 only
      .reverse();           // newest on top

    setSignals(resolved);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary row (already expected by Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total Signals" value={signals.length} />
        <Stat label="Resolved" value={signals.length} />
        <Stat label="Win Rate" value={calcWinRate(signals)} />
      </div>

      {/* History */}
      <div className="bg-slate-900/60 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">
          Recent 15m Crypto Outcomes
        </h3>

        {signals.length === 0 ? (
          <div className="text-sm text-gray-400">
            No resolved signals yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {signals.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between bg-slate-800/70 rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-medium">
                    {s.asset} · 15m · {s.direction.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">
                    Entry: {formatTime(s.entryAt)} · Resolve:{" "}
                    {formatTime(s.resolveAt)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-purple-300">
                    {Math.round(s.confidence * 100)}%
                  </div>

                  <ResultBadge win={s.result === "WIN"} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Stat({ label, value }) {
  return (
    <div className="bg-slate-900/70 rounded-lg p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ResultBadge({ win }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        win
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {win ? "WIN" : "LOSS"}
    </span>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calcWinRate(signals) {
  if (!signals.length) return "—";
  const wins = signals.filter((s) => s.result === "WIN").length;
  return `${Math.round((wins / signals.length) * 100)}%`;
}

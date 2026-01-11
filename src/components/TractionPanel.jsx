import { useEffect, useState } from "react";
import { getResolvedSignals } from "../engine/signalAutoResolver";

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const load = () => {
      setSignals(getResolvedSignals(4));
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const wins = signals.filter(s => s.outcome === "WIN").length;
  const losses = signals.filter(s => s.outcome === "LOSS").length;
  const winRate =
    signals.length > 0
      ? Math.round((wins / signals.length) * 100)
      : null;

  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-white/60">Resolved</div>
          <div className="text-2xl font-bold">{signals.length}</div>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-white/60">Wins</div>
          <div className="text-2xl font-bold text-green-400">
            {wins}
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-white/60">Win Rate</div>
          <div className="text-2xl font-bold">
            {winRate !== null ? `${winRate}%` : "—"}
          </div>
        </div>
      </div>

      {/* Recent outcomes */}
      <div className="rounded-xl bg-white/5 p-4">
        <h4 className="font-semibold mb-3">
          Recent 15m Crypto Outcomes
        </h4>

        {signals.length === 0 && (
          <div className="text-white/50 text-sm">
            No resolved signals yet.
          </div>
        )}

        <div className="space-y-2">
          {signals.map(s => (
            <div
              key={s.id}
              className="flex justify-between items-center text-sm border-b border-white/10 pb-1"
            >
              <div>
                <span className="font-semibold">{s.asset}</span>{" "}
                {s.direction} ·{" "}
                {new Date(s.createdAt).toLocaleTimeString()}
              </div>

              <div
                className={
                  s.outcome === "WIN"
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {s.outcome}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

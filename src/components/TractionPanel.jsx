// src/components/TractionPanel.jsx

import { useEffect, useState } from "react";
import {
  getLastResolvedSignals,
} from "../engine/Crypto15mSignalEngine";
import SignalProofCard from "./SignalProofCard";

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const load = () => {
      setSignals(getLastResolvedSignals(6));
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const wins = signals.filter(s => s.result === "WIN").length;
  const winRate =
    signals.length > 0
      ? Math.round((wins / signals.length) * 100)
      : null;

  return (
    <div className="space-y-6">

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-sm text-white/60">
            Resolved
          </div>
          <div className="text-2xl font-bold">
            {signals.length}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-sm text-white/60">
            Wins
          </div>
          <div className="text-2xl font-bold text-green-400">
            {wins}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-sm text-white/60">
            Win Rate
          </div>
          <div className="text-2xl font-bold">
            {winRate !== null ? `${winRate}%` : "—"}
          </div>
        </div>
      </div>

      {/* Recent Outcomes */}
      <div className="rounded-xl bg-white/5 p-4">
        <h4 className="font-semibold mb-3">
          Recent 15m Crypto Outcomes
        </h4>

        {signals.length === 0 ? (
          <div className="text-white/50 text-sm">
            No resolved signals yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {signals.map(signal => (
              <SignalProofCard
                key={signal.id}
                signal={signal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

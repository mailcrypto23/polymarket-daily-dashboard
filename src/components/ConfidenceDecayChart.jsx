import { useEffect, useState } from "react";
import { getConfidenceDecayStats } from "../engine/confidenceDecayAnalytics";

export default function ConfidenceDecayChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getConfidenceDecayStats());
  }, []);

  return (
    <div className="rounded-xl bg-black/40 border border-white/10 p-5">
      <h3 className="font-semibold mb-4">
        Confidence Decay vs Entry Timing
      </h3>

      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1">
              <span>{r.label}</span>
              <span>
                {r.winRate !== null ? `${r.winRate}%` : "—"}
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-700"
                style={{
                  width: r.winRate ? `${r.winRate}%` : "0%",
                }}
              />
            </div>

            <div className="text-[10px] text-white/40 mt-1">
              {r.count} signals
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getEntryTimingPnLStats } from "../engine/entryTimingPnLAnalytics";

export default function EntryTimingPnLChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getEntryTimingPnLStats());
  }, []);

  return (
    <div className="rounded-xl bg-black/40 border border-white/10 p-5">
      <h3 className="font-semibold mb-4">
        Entry Timing vs PnL (Edge Decay)
      </h3>

      <div className="space-y-4">
        {rows.map(r => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1">
              <span>{r.label}</span>
              <span
                className={
                  r.avgPnL > 0
                    ? "text-green-400"
                    : r.avgPnL < 0
                    ? "text-red-400"
                    : "text-white/40"
                }
              >
                {r.avgPnL !== null ? r.avgPnL : "—"}
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  r.avgPnL >= 0
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
                style={{
                  width:
                    r.avgPnL !== null
                      ? `${Math.min(
                          Math.abs(r.avgPnL) * 50,
                          100
                        )}%`
                      : "0%",
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

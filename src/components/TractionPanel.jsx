import React, { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_log";

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function exportCSV(signals) {
  if (!signals.length) return;

  const headers = Object.keys(signals[0]).join(",");
  const rows = signals.map(s =>
    Object.values(s)
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pm_signal_history.csv";
  a.click();
}

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    setSignals(loadSignals());
  }, []);

  const total = signals.length;
  const resolved = signals.filter(s => s.result);
  const wins = resolved.filter(s => s.result === "WIN").length;
  const winRate = resolved.length
    ? ((wins / resolved.length) * 100).toFixed(1)
    : "—";

  return (
    <div className="bg-[#0b1220] rounded-xl p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">
        📊 Traction & Signal Performance
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div className="bg-[#111a2e] p-3 rounded">
          <div className="opacity-60">Total Signals</div>
          <div className="text-xl font-bold">{total}</div>
        </div>
        <div className="bg-[#111a2e] p-3 rounded">
          <div className="opacity-60">Resolved</div>
          <div className="text-xl font-bold">{resolved.length}</div>
        </div>
        <div className="bg-[#111a2e] p-3 rounded">
          <div className="opacity-60">Win Rate</div>
          <div className="text-xl font-bold">{winRate}%</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs opacity-60">
          Source: local signal log (read-only)
        </span>
        <button
          onClick={() => exportCSV(signals)}
          className="text-xs px-3 py-1 rounded bg-purple-600 hover:bg-purple-700"
        >
          Export CSV
        </button>
      </div>

      {/* History */}
      <div className="max-h-64 overflow-auto text-xs">
        <table className="w-full">
          <thead className="sticky top-0 bg-[#0b1220]">
            <tr className="opacity-70 text-left">
              <th>Time</th>
              <th>Market</th>
              <th>Side</th>
              <th>Confidence</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {signals
              .slice()
              .reverse()
              .map((s, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td>{new Date(s.ts).toLocaleTimeString()}</td>
                  <td>{s.market}</td>
                  <td
                    className={
                      s.side === "YES" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {s.side}
                  </td>
                  <td>{s.confidence}%</td>
                  <td>
                    {s.result ? (
                      s.result === "WIN" ? (
                        <span className="text-green-400">WIN</span>
                      ) : (
                        <span className="text-red-400">LOSS</span>
                      )
                    ) : (
                      <span className="opacity-40">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

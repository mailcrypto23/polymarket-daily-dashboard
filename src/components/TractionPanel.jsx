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

  const headers = [
    "timestamp",
    "market",
    "side",
    "confidence",
    "source",
    "outcome"
  ];

  const rows = signals.map(s =>
    headers.map(h => s[h] ?? "").join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pm_signal_history.csv";
  a.click();

  URL.revokeObjectURL(url);
}

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    setSignals(loadSignals());
  }, []);

  const total = signals.length;
  const resolved = signals.filter(s => s.outcome === "win" || s.outcome === "loss");
  const wins = resolved.filter(s => s.outcome === "win").length;

  const winRate =
    resolved.length > 0
      ? ((wins / resolved.length) * 100).toFixed(1)
      : "—";

  return (
    <div className="bg-[#0b1220] rounded-xl p-5 border border-white/10">
      <h2 className="text-lg font-semibold text-white mb-4">
        📊 Signal Traction
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-xs text-gray-400">Total Signals</div>
          <div className="text-xl font-bold text-white">{total}</div>
        </div>

        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-xs text-gray-400">Resolved</div>
          <div className="text-xl font-bold text-white">{resolved.length}</div>
        </div>

        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-xs text-gray-400">Win Rate</div>
          <div className="text-xl font-bold text-green-400">
            {winRate === "—" ? "Pending" : `${winRate}%`}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="py-2">Time</th>
              <th>Market</th>
              <th>Side</th>
              <th>Conf.</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {signals.slice().reverse().map((s, i) => (
              <tr key={i} className="border-b border-white/5 text-white">
                <td className="py-2 text-xs">
                  {new Date(s.timestamp).toLocaleTimeString()}
                </td>
                <td className="max-w-[240px] truncate">{s.market}</td>
                <td className={s.side === "YES" ? "text-green-400" : "text-red-400"}>
                  {s.side}
                </td>
                <td>{s.confidence}%</td>
                <td className="text-gray-400">
                  {s.outcome ?? "—"}
                </td>
              </tr>
            ))}
            {!signals.length && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No signals recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => exportCSV(signals)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}

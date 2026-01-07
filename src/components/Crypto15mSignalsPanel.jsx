import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // ✅ sanitize
        const clean = raw.filter(
          s =>
            s &&
            typeof s.createdAt === "number" &&
            s.market &&
            s.side &&
            typeof s.confidence === "number"
        );

        setSignals(clean);
      } catch {
        setSignals([]);
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 newest first
  const sorted = [...signals].sort((a, b) => b.createdAt - a.createdAt);

  const topFive = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  const renderRow = (s, dim = false) => (
    <tr
      key={s.createdAt + s.market}
      className={`border-t border-white/10 ${
        dim ? "text-white/60" : ""
      }`}
    >
      <td className="p-3">
        {new Date(s.createdAt).toLocaleString()}
      </td>
      <td className="p-3">{s.market}</td>
      <td className="p-3">{s.side}</td>
      <td className="p-3">{s.confidence}%</td>
    </tr>
  );

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* TOP 5 */}
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3 text-left">Side</th>
            <th className="p-3 text-left">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map(s => renderRow(s))}
        </tbody>
      </table>

      {/* HISTORY */}
      {rest.length > 0 && (
        <div className="max-h-64 overflow-y-auto border-t border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {rest.map(s => renderRow(s, true))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

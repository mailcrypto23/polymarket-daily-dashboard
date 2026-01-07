import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setSignals(data);
      } catch {
        setSignals([]);
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Latest first
  const sorted = [...signals].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  // 🔹 Show only top 5
  const topFive = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      {/* TOP 5 (VISIBLE) */}
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
          {topFive.map((s, i) => (
            <tr key={i} className="border-t border-white/10">
              <td className="p-3">
                {new Date(s.createdAt).toLocaleString()}
              </td>
              <td className="p-3">{s.market}</td>
              <td className="p-3">{s.side}</td>
              <td className="p-3">{s.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SCROLLABLE HISTORY */}
      {rest.length > 0 && (
        <div className="max-h-64 overflow-y-auto border-t border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {rest.map((s, i) => (
                <tr key={i} className="border-t border-white/5 text-white/60">
                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">{s.market}</td>
                  <td className="p-3">{s.side}</td>
                  <td className="p-3">{s.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

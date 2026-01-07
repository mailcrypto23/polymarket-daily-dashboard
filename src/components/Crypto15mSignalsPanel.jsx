import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  // 🔁 Poll localStorage for live updates
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

  // ✅ Sort newest first
  const sorted = [...signals].sort(
    (a, b) =>
      (b.createdAt || b.timestamp || 0) -
      (a.createdAt || a.timestamp || 0)
  );

  const latestFive = sorted.slice(0, 5);
  const remaining = sorted.slice(5);

  const formatTime = (s) => {
    const t = s.createdAt || s.timestamp;
    if (!t) return "—";
    return new Date(t).toLocaleString();
  };

  return (
    <div className="space-y-4">

      {/* 🔥 LATEST 5 SIGNALS */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Market</th>
              <th className="p-3 text-center">Side</th>
              <th className="p-3 text-center">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {latestFive.map((s, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center font-semibold">
                  {s.side}
                </td>
                <td className="p-3 text-center">
                  {s.confidence}%
                </td>
              </tr>
            ))}

            {latestFive.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-white/50"
                >
                  Waiting for signals…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📜 SCROLLABLE HISTORY */}
      {remaining.length > 0 && (
        <div className="rounded-xl border border-white/10 max-h-[420px] overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {remaining.map((s, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="p-3 w-48 text-white/60">
                    {formatTime(s)}
                  </td>
                  <td className="p-3">{s.market}</td>
                  <td className="p-3 text-center">{s.side}</td>
                  <td className="p-3 text-center">
                    {s.confidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

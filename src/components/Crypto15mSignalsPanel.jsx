import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSignals(data);
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const sorted = [...signals].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  const topFive = sorted.slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3">Side</th>
            <th className="p-3">Confidence</th>
            <th className="p-3">Countdown</th>
            <th className="p-3">Result</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((s, i) => {
            const remaining = (s.resolveAt || 0) - Date.now();

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.side}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className="p-3 text-center">
                  {formatCountdown(remaining)}
                </td>
                <td className="p-3 text-center uppercase text-white/70">
                  {s.outcome}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

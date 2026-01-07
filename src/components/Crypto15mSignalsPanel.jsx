import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString();
}

function formatCountdown(ms) {
  if (!ms || ms <= 0) return "LOCKED";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function decisionColor(d) {
  if (d === "CONSIDER") return "text-green-400";
  if (d === "SKIP") return "text-red-400";
  return "text-white/60";
}

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
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const topFive = [...signals]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3 text-center">Side</th>
            <th className="p-3 text-center">Conf</th>
            <th className="p-3 text-center">Countdown</th>
            <th className="p-3 text-center">Decision</th>
          </tr>
        </thead>

        <tbody>
          {topFive.map((s, i) => {
            const remaining = (s.resolveAt || 0) - Date.now();

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center font-semibold">
                  {s.side}
                </td>
                <td className="p-3 text-center">
                  {s.confidence}%
                </td>
                <td className="p-3 text-center">
                  {formatCountdown(remaining)}
                </td>

                {/* ✅ DECISION CELL */}
                <td
                  className={`p-3 text-center font-semibold ${decisionColor(
                    s.decision
                  )}`}
                >
                  {s.decision}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

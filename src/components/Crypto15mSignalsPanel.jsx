import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

function fmtTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString() : "—";
}

function countdown(ms) {
  if (ms <= 0) return "00:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function decision(s) {
  if (s.outcome !== "pending") return "DONE";
  if (s.confidence >= 65) return "TRADE";
  if (s.confidence >= 58) return "SMALL";
  return "SKIP";
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

  const top5 = [...signals]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
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
          {top5.map((s, i) => {
            const remain = (s.resolveAt ?? s.createdAt + TF) - Date.now();
            const d = decision(s);

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{fmtTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.side}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className="p-3 text-center">{countdown(remain)}</td>
                <td
                  className={`p-3 text-center font-semibold ${
                    d === "TRADE"
                      ? "text-green-400"
                      : d === "SMALL"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {d}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

function formatTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString() : "—";
}

function formatCountdown(ms) {
  if (ms <= 0) return "LOCKED";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function entryState(ms) {
  if (ms <= 0) return "LOCKED";
  if (ms > TF * 0.6) return "SAFE";
  if (ms > TF * 0.25) return "RISKY";
  return "LATE";
}

function decisionLabel(signal, state) {
  if (state !== "SAFE") return "SKIP";
  if (signal.confidence >= 60) return "TRADE";
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
            <th className="p-3">Bias</th>
            <th className="p-3">Conf</th>
            <th className="p-3">Countdown</th>
            <th className="p-3">Entry</th>
            <th className="p-3">Decision</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map((s, i) => {
            const remaining = s.resolveAt - Date.now();
            const state = entryState(remaining);
            const decision = decisionLabel(s, state);

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.bias}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className="p-3 text-center">
                  {formatCountdown(remaining)}
                </td>
                <td className="p-3 text-center">{state}</td>
                <td
                  className={`p-3 text-center font-semibold ${
                    decision === "TRADE"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {decision}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-xs text-white/40 p-3 border-t border-white/10">
        ⚠ Signals are simulated analytics. Use bias + timing for manual trades.
      </div>
    </div>
  );
}

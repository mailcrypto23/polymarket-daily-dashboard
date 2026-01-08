import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

function formatTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString() : "—";
}

function formatCountdown(ms) {
  if (ms <= 0) return "LOCKED";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

function entryState(ms) {
  if (ms <= 0) return "LOCKED";
  if (ms > TF * 0.6) return "SAFE";
  if (ms > TF * 0.25) return "RISKY";
  return "LATE";
}

function progressPct(ms) {
  return Math.max(0, Math.min(100, (ms / TF) * 100));
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      setSignals(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    };
    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const acknowledge = idx => {
    const copy = [...signals];
    copy[idx].acknowledged = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    setSignals(copy);
  };

  const topFive = [...signals]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3">Bias</th>
            <th className="p-3">Conf</th>
            <th className="p-3">Window</th>
            <th className="p-3">Entry Hint</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {topFive.map((s, i) => {
            const remaining = s.resolveAt - Date.now();
            const state = entryState(remaining);
            const pct = progressPct(remaining);

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.bias}</td>
                <td className="p-3 text-center">{s.confidence}%</td>

                <td className="p-3">
                  <div className="text-xs mb-1">{formatCountdown(remaining)}</div>
                  <div className="h-1 bg-white/10 rounded">
                    <div
                      className={`h-1 rounded ${
                        state === "SAFE"
                          ? "bg-green-400"
                          : state === "RISKY"
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>

                <td className="p-3 text-xs">{s.entryHint}</td>

                <td className="p-3 text-center">
                  {state === "SAFE" && !s.acknowledged ? (
                    <button
                      onClick={() => acknowledge(i)}
                      className="px-2 py-1 bg-green-500 text-black rounded text-xs"
                    >
                      I Took Trade
                    </button>
                  ) : (
                    <span className="text-white/40 text-xs">
                      {s.acknowledged ? "Logged" : "Skip"}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-xs text-white/40 p-3 border-t border-white/10">
        🟢 Trade only during SAFE window · 📊 Manual confirmation enables real stats
      </div>
    </div>
  );
}

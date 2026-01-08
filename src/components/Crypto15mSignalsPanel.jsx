import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

const alertSound =
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

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
  return signal.confidence >= 60 ? "TRADE" : "SKIP";
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);
  const notified = useRef(new Set());
  const soundEnabled = useRef(false);

  const enableSound = () => {
    soundEnabled.current = true;
    new Audio(alertSound).play().catch(() => {});
  };

  useEffect(() => {
    const poll = () => {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      // ✅ show signals until resolveAt passes
      const active = raw.filter(
        s =>
          typeof s.resolveAt === "number" &&
          Date.now() < s.resolveAt
      );

      active.forEach(s => {
        if (s.isNew && !notified.current.has(s.id)) {
          notified.current.add(s.id);
          s.isNew = false;

          if (soundEnabled.current) {
            new Audio(alertSound).play().catch(() => {});
          }

          window.dispatchEvent(
            new CustomEvent("signal-toast", { detail: s })
          );
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
      setSignals(active);
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const handler = e => {
      const s = e.detail;
      alert(
        `🔔 New 15m Signal\n\n${s.market}\nBias: ${s.bias}\nConfidence: ${s.confidence}%\n\nEnter during SAFE window`
      );
    };
    window.addEventListener("signal-toast", handler);
    return () => window.removeEventListener("signal-toast", handler);
  }, []);

  const topFive = [...signals]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="p-3 border-b border-white/10">
        <button
          onClick={enableSound}
          className="px-3 py-1 rounded bg-purple-600 text-white text-xs"
        >
          🔊 Enable Alert Sound
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3">Bias</th>
            <th className="p-3">Conf</th>
            <th className="p-3">Countdown</th>
            <th className="p-3">Entry</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {topFive.map(s => {
            const remaining = s.resolveAt - Date.now();
            const state = entryState(remaining);
            const action = decisionLabel(s, state);

            return (
              <tr key={s.id} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.bias}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className="p-3 text-center">
                  {formatCountdown(remaining)}
                </td>
                <td className="p-3 text-center">{state}</td>
                <td
                  className={`p-3 text-center font-bold ${
                    action === "TRADE"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {action}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-xs text-white/40 p-3 border-t border-white/10">
        🔔 Toast + sound on new signal · ⏳ Trade ONLY during SAFE window
      </div>
    </div>
  );
}

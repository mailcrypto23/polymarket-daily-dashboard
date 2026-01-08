import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

const alertSound =
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

function formatTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString() : "—";
}

function formatCountdown(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "LOCKED";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function entryState(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "LOCKED";
  if (ms > TF * 0.6) return "SAFE";
  if (ms > TF * 0.25) return "RISKY";
  return "LATE";
}

function decisionLabel(signal, state) {
  return state === "SAFE" && signal.confidence >= 60 ? "TRADE" : "SKIP";
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);
  const [toasts, setToasts] = useState([]);
  const notified = useRef(new Set());

  useEffect(() => {
    const poll = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      data.forEach(s => {
        // 🔥 BACKFILL OLD SIGNALS
        if (!s.notifyAt) s.notifyAt = s.createdAt;

        if (!notified.current.has(s.createdAt)) {
          notified.current.add(s.createdAt);

          // 🔔 sound (after first click browser allows it)
          try {
            new Audio(alertSound).play();
          } catch {}

          // 🍞 toast
          setToasts(prev => [
            {
              id: s.createdAt,
              market: s.market,
              bias: s.bias,
              confidence: s.confidence
            },
            ...prev
          ]);

          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== s.createdAt));
          }, 6000);
        }
      });

      setSignals(data);
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const topFive = [...signals]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="relative rounded-xl border border-white/10 overflow-hidden">

      {/* 🔔 TOASTS */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-black/90 border border-white/20 rounded-lg p-4 w-72 shadow-xl"
          >
            <div className="font-semibold text-white">🔔 New 15m Signal</div>
            <div className="text-xs text-white/70">{t.market}</div>
            <div className="mt-2 text-xs">
              Bias: <b className="text-blue-400">{t.bias}</b>
            </div>
            <div className="text-xs">
              Confidence: <b>{t.confidence}%</b>
            </div>
            <div className="text-[11px] text-yellow-400 mt-2">
              Enter during SAFE window
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3">Time</th>
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
                <td className="p-3 text-center">{formatCountdown(remaining)}</td>
                <td className="p-3 text-center">{state}</td>
                <td className={`p-3 text-center font-bold ${
                  decision === "TRADE" ? "text-green-400" : "text-red-400"
                }`}>
                  {decision}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-xs text-white/40 p-3 border-t border-white/10">
        🔔 Toast + sound on each new signal · ⏳ Trade only in SAFE window
      </div>
    </div>
  );
}

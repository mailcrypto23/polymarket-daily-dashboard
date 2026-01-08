import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;
const alertSound =
  "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

function normalizeSignal(s) {
  const now = Date.now();

  return {
    id: s.id ?? crypto.randomUUID(),
    market: s.market ?? "Unknown Market",
    bias: s.bias ?? s.side ?? "NO",
    confidence: Number(s.confidence ?? 55),
    createdAt: typeof s.createdAt === "number" ? s.createdAt : now,
    resolveAt:
      typeof s.resolveAt === "number" ? s.resolveAt : now + TF,
    notifyAt: typeof s.notifyAt === "number" ? s.notifyAt : s.createdAt ?? now,
    outcome: s.outcome ?? "pending"
  };
}

function entryWindow(ms) {
  if (ms <= 0) return { label: "CLOSED", color: "text-red-400" };
  if (ms > TF * 0.6)
    return { label: `SAFE (${Math.floor(ms / 60000)}m)`, color: "text-green-400" };
  if (ms > TF * 0.25)
    return { label: "RISKY", color: "text-yellow-400" };
  return { label: "LATE", color: "text-red-400" };
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);
  const notified = useRef(new Set());
  const audioUnlocked = useRef(false);

  const unlockSound = () => {
    new Audio(alertSound).play().catch(() => {});
    audioUnlocked.current = true;
  };

  useEffect(() => {
    const poll = () => {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const normalized = raw.map(normalizeSignal);

      normalized.forEach(s => {
        if (!notified.current.has(s.id) && Date.now() >= s.notifyAt) {
          notified.current.add(s.id);
          if (audioUnlocked.current) {
            new Audio(alertSound).play().catch(() => {});
          }
        }
      });

      setSignals(normalized);
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const top = [...signals]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={unlockSound}
        className="m-3 px-3 py-1 text-xs bg-white/10 rounded"
      >
        🔊 Enable Alert Sound
      </button>

      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3">Bias</th>
            <th className="p-3">Conf</th>
            <th className="p-3">Entry Window</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {top.map(s => {
            const remaining = s.resolveAt - Date.now();
            const win = entryWindow(remaining);

            return (
              <tr key={s.id} className="border-t border-white/10">
                <td className="p-3">
                  {new Date(s.createdAt).toLocaleTimeString()}
                </td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.bias}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className={`p-3 text-center ${win.color}`}>
                  {win.label}
                </td>
                <td className="p-3 text-center font-bold">
                  {win.label.startsWith("SAFE") && s.confidence >= 60
                    ? "TRADE"
                    : "SKIP"}
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

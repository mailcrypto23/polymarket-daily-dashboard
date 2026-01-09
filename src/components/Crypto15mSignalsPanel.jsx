import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const TF = 15 * 60 * 1000;

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

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSignals(raw.filter(s => s.outcome === "pending"));
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  if (!signals.length) {
    return (
      <div className="text-white/50 p-6">
        Waiting for next 15m signal…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signals.map(s => {
        const remaining = s.resolveAt - Date.now();
        const state = entryState(remaining);

        return (
          <div
            key={s.id}
            className="rounded-xl border border-white/10 p-4 bg-white/5"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{s.market}</div>
                <div className="text-sm text-white/60">
                  Bias: <b>{s.bias}</b> · Confidence:{" "}
                  <b>{s.confidence}%</b>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Countdown</div>
                <div className="font-mono">
                  {formatCountdown(remaining)}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-white/70">
              Entry: ${s.entryPrice.toFixed(2)} → Current: $
              {s.currentPrice.toFixed(2)}
            </div>

            <div className="mt-2 text-xs text-white/50">
              {s.confidenceReason}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                disabled={state !== "SAFE"}
                className="px-4 py-2 rounded bg-green-600 disabled:opacity-30"
              >
                ENTER
              </button>
              <button className="px-4 py-2 rounded bg-red-600">
                SKIP
              </button>
              <div className="ml-auto text-xs text-white/40">
                Window: {state}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const data =
          JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setSignals(data);
      } catch {
        setSignals([]);
      }
    };

    // 🔹 Load immediately
    load();

    // 🔹 Poll every second (safe + lightweight)
    const interval = setInterval(load, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!signals.length) {
    return (
      <div className="rounded-xl p-6 border border-white/10 text-center text-white/50">
        Waiting for next 15-minute window…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {signals.map(s => (
        <div
          key={s.id}
          className="flex justify-between rounded-lg bg-white/5 p-3"
        >
          <div>
            <div className="font-medium">{s.market}</div>
            <div className="text-sm text-white/60">
              {s.side} · {s.confidence}%
            </div>
          </div>

          <div className="text-sm">
            {s.outcome === "pending" ? "⏳ Pending" : s.outcome}
          </div>
        </div>
      ))}
    </div>
  );
}

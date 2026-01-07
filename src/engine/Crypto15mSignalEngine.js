import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const syncSignals = () => {
      try {
        const data =
          JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setSignals(data);
      } catch {
        setSignals([]);
      }
    };

    // 🔹 Load immediately
    syncSignals();

    // 🔹 Poll localStorage every second
    const interval = setInterval(syncSignals, 1000);

    return () => clearInterval(interval);
  }, []);

  if (signals.length === 0) {
    return (
      <div className="rounded-xl p-6 border border-white/10 text-center text-white/50">
        Waiting for next 15-minute window…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...signals].reverse().map(signal => (
        <div
          key={signal.id}
          className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-white/5"
        >
          <div>
            <div className="font-semibold">{signal.market}</div>
            <div className="text-xs text-white/60">
              {new Date(signal.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <div className="text-center">
            <div
              className={`font-bold ${
                signal.side === "YES"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {signal.side}
            </div>
            <div className="text-xs text-white/60">
              {signal.confidence}% confidence
            </div>
          </div>

          <div className="text-sm text-white/70">
            {signal.outcome || "pending"}
          </div>
        </div>
      ))}
    </div>
  );
}

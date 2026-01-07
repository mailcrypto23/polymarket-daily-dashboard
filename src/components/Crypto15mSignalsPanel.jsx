import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);
  const [, forceRender] = useState(0); // countdown tick

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
    const poller = setInterval(poll, 1000);
    const ticker = setInterval(() => forceRender(t => t + 1), 1000);

    return () => {
      clearInterval(poller);
      clearInterval(ticker);
    };
  }, []);

  // newest first
  const sorted = [...signals].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  const topFive = sorted.slice(0, 5);

  const formatCountdown = ms => {
    if (ms <= 0) return "00:00";
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3 text-left">Side</th>
            <th className="p-3 text-left">Confidence</th>
            <th className="p-3 text-left">Countdown</th>
            <th className="p-3 text-left">Result</th>
          </tr>
        </thead>

        <tbody>
          {topFive.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-white/50">
                Waiting for next signal…
              </td>
            </tr>
          ) : (
            topFive.map((s, i) => {
              const remaining = s.resolveAt
                ? s.resolveAt - Date.now()
                : 0;

              const color =
                s.outcome === "win"
                  ? "text-green-400"
                  : s.outcome === "loss"
                  ? "text-red-400"
                  : "text-white/70";

              return (
                <tr
                  key={i}
                  className={`border-t border-white/10 ${color}`}
                >
                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">{s.market}</td>
                  <td className="p-3 font-semibold">{s.side}</td>
                  <td className="p-3">{Math.round(s.confidence)}%</td>
                  <td className="p-3 font-mono">
                    {s.outcome === "pending"
                      ? formatCountdown(remaining)
                      : "—"}
                  </td>
                  <td className="p-3 uppercase">{s.outcome}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

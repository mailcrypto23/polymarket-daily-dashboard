import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const readSignals = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setSignals(parsed);
      } catch {
        setSignals([]);
      }
    };

    readSignals(); // initial
    const interval = setInterval(readSignals, 1000); // 🔁 LIVE POLL

    return () => clearInterval(interval);
  }, []);

  if (!signals.length) {
    return (
      <div className="rounded-xl p-6 border border-white/10 text-center text-white/50">
        Waiting for signals…
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="text-white/60 border-b border-white/10">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3 text-left">Side</th>
            <th className="p-3 text-left">Confidence</th>
            <th className="p-3 text-left">Result</th>
          </tr>
        </thead>
        <tbody>
          {signals.map(s => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-3">
                {new Date(s.createdAt).toLocaleTimeString()}
              </td>
              <td className="p-3">{s.market}</td>
              <td className="p-3">{s.side}</td>
              <td className="p-3">{s.confidence}%</td>
              <td className="p-3 capitalize">
                {s.outcome ?? "pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

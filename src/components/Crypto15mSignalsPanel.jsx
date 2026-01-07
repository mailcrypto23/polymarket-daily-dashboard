import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const readSignals = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSignals(data.slice().reverse());
    };

    readSignals();
    const interval = setInterval(readSignals, 1000);
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
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3">Side</th>
            <th className="p-3">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {signals.map(s => (
            <tr key={s.id} className="border-t border-white/5">
              <td className="p-3">{new Date(s.createdAt).toLocaleTimeString()}</td>
              <td className="p-3">{s.market}</td>
              <td className="p-3">{s.side}</td>
              <td className="p-3">{s.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

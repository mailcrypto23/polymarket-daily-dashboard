import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_log";

export default function SignalHistoryPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Show latest first, limit to 10
        setSignals(parsed.slice(-10).reverse());
      }
    } catch (err) {
      console.error("Failed to load signal history", err);
    }
  }, []);

  if (!signals.length) {
    return (
      <div className="bg-[#0b1220] rounded-xl p-4 text-gray-400 text-sm">
        No signals logged yet.
      </div>
    );
  }

  return (
    <div className="bg-[#0b1220] rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">
        📜 Signal History (last 10)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Time</th>
              <th>Market</th>
              <th>Side</th>
              <th>Confidence</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {signals.map((s, i) => (
              <tr
                key={i}
                className="border-b border-gray-800 text-gray-200"
              >
                <td className="py-2">
                  {new Date(s.timestamp).toLocaleTimeString()}
                </td>
                <td>{s.market}</td>
                <td
                  className={
                    s.side === "YES"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {s.side}
                </td>
                <td>{s.confidence}%</td>
                <td className="text-gray-400">{s.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function SignalPopup({ signal, onClose }) {
  const [remaining, setRemaining] = useState(
    signal.resolveAt - Date.now()
  );

  useEffect(() => {
    const i = setInterval(() => {
      const r = signal.resolveAt - Date.now();
      setRemaining(r);
      if (r <= 0) onClose();
    }, 1000);

    return () => clearInterval(i);
  }, [signal, onClose]);

  if (remaining <= 0) return null;

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-black border border-green-500 rounded-xl p-4 shadow-xl w-80">
      <h3 className="text-green-400 font-semibold mb-2">
        🔔 New 15m Signal
      </h3>

      <div className="text-sm text-white">
        <div>{signal.market}</div>
        <div className="mt-1">
          Bias: <b>{signal.side}</b> · Conf: {signal.confidence}%
        </div>
        <div className="mt-2 text-green-300">
          Enter within: {mins}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-3 w-full text-sm bg-gray-800 hover:bg-gray-700 rounded py-1"
      >
        Dismiss
      </button>
    </div>
  );
}

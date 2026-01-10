// src/components/Crypto15mSignalCard.jsx
import SafeWindowTimer from "./SafeWindowTimer";

export default function Crypto15mSignalCard({ signal, onDecision }) {
  if (!signal) return null;

  const locked = Date.now() > signal.safeUntil;

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-900/40 to-black/40 p-4 border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-white font-semibold">
            {signal.symbol} · 15m
          </div>
          <div className="text-xs text-white/50">
            Bias: {signal.bias}
          </div>
        </div>
        <div className="text-purple-400 font-bold">
          {signal.confidence}%
        </div>
      </div>

      <SafeWindowTimer
        createdAt={signal.createdAt}
        safeUntil={signal.safeUntil}
        resolveAt={signal.resolveAt}
      />

      <div className="flex gap-3 mt-4">
        <button
          disabled={locked}
          onClick={() => onDecision(signal.id, "ENTER")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold
            ${locked ? "bg-gray-700 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
        >
          ENTER
        </button>

        <button
          onClick={() => onDecision(signal.id, "SKIP")}
          className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500"
        >
          SKIP
        </button>
      </div>
    </div>
  );
}

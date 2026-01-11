// src/components/SignalProofCard.jsx

export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.result === "WIN";

  return (
    <div
      className={`rounded-xl p-4 border space-y-3 ${
        isWin
          ? "bg-green-500/5 border-green-400/20"
          : "bg-red-500/5 border-red-400/20"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold">
          {signal.symbol} · 15m · {signal.direction}
        </div>

        <div
          className={`text-sm font-bold ${
            isWin ? "text-green-400" : "text-red-400"
          }`}
        >
          {signal.result}
        </div>
      </div>

      {/* Confidence */}
      <div className="text-xs text-white/70">
        Confidence:{" "}
        <span className="font-semibold text-white">
          {Math.round(signal.confidence * 100)}%
        </span>
      </div>

      {/* Timing */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-white/50">Entry</div>
          <div className="font-mono text-white">
            {new Date(signal.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div>
          <div className="text-white/50">Resolved</div>
          <div className="font-mono text-white">
            {new Date(signal.resolveAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

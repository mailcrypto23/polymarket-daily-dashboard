// src/components/SignalProofCard.jsx

export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.outcome === "WIN";
  const pnl =
    signal.direction === "UP"
      ? signal.exitPrice - signal.entryPrice
      : signal.entryPrice - signal.exitPrice;

  return (
    <div
      className={`
        rounded-xl p-4 border space-y-3
        ${
          isWin
            ? "bg-green-500/5 border-green-400/20"
            : "bg-red-500/5 border-red-400/20"
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold">
          {signal.asset} · 15m · {signal.direction}
        </div>

        <div
          className={`text-sm font-bold ${
            isWin ? "text-green-400" : "text-red-400"
          }`}
        >
          {signal.outcome}
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-white/50">Entry</div>
          <div className="font-mono text-white">
            ${Number(signal.entryPrice).toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-white/50">Exit</div>
          <div className="font-mono text-white">
            ${Number(signal.exitPrice).toFixed(2)}
          </div>
        </div>
      </div>

      {/* PnL */}
      <div className="text-xs">
        <span className="text-white/50">PnL:</span>{" "}
        <span
          className={`font-mono ${
            pnl >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {pnl >= 0 ? "+" : ""}
          {pnl.toFixed(2)}
        </span>
      </div>

      {/* Time */}
      <div className="text-[11px] text-white/40 pt-1">
        Resolved at{" "}
        {new Date(signal.resolvedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

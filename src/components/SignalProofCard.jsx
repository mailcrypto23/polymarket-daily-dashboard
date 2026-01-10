export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.outcome === "WIN";

  return (
    <div className="rounded-xl bg-black/40 p-4 border border-white/10 space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">
          {signal.symbol} · 15m · {signal.direction}
        </span>

        <span
          className={`text-sm font-bold ${
            isWin ? "text-green-400" : "text-red-400"
          }`}
        >
          {signal.outcome}
        </span>
      </div>

      {/* Prices */}
      <div className="text-xs text-white/70 space-y-1">
        <div>
          Entry Price:{" "}
          <span className="font-mono text-white">
            ${Number(signal.entryPrice).toFixed(2)}
          </span>
        </div>

        <div>
          Exit Price:{" "}
          <span className="font-mono text-white">
            ${Number(signal.exitPrice).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Timing */}
      <div className="text-[11px] text-white/50 pt-1">
        Resolved at{" "}
        {new Date(signal.resolvedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

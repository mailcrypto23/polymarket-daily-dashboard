export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.outcome === "WIN";

  const entry = Number(signal.entryPrice);
  const exit = Number(signal.exitPrice);
  const pnl = exit - entry;
  const pnlPct = entry ? ((pnl / entry) * 100).toFixed(2) : "0.00";

  return (
    <div className="rounded-xl bg-black/40 border border-white/10 p-4 space-y-3">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold">
          {signal.symbol || signal.asset} · 15m · {signal.direction}
        </div>

        <div
          className={`text-sm font-bold ${
            isWin ? "text-green-400" : "text-red-400"
          }`}
        >
          {signal.outcome}
        </div>
      </div>

      {/* Price Proof */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-white/5 p-2">
          <div className="text-white/50 mb-1">Entry</div>
          <div className="font-mono text-white">
            ${entry.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-2">
          <div className="text-white/50 mb-1">Exit</div>
          <div className="font-mono text-white">
            ${exit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* PnL */}
      <div
        className={`text-xs font-semibold ${
          pnl >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        PnL: {pnl >= 0 ? "+" : ""}
        {pnl.toFixed(2)} ({pnlPct}%)
      </div>

      {/* Resolution Time */}
      <div className="text-[11px] text-white/50">
        Resolved at{" "}
        {new Date(signal.resolvedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

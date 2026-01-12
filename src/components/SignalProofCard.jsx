export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.outcome === "WIN";

  const entry = Number(signal.entryPrice);
  const exit = Number(signal.exitPrice);
  const pnl = exit - entry;
  const pnlPct = entry ? ((pnl / entry) * 100).toFixed(2) : "0.00";

  return (
    <div className="card p-5 space-y-4 bg-black/50">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="text-base font-semibold">
          {signal.symbol || signal.asset} · 15m · {signal.direction}
        </div>

        <div
          className={`text-base font-extrabold ${
            isWin ? "text-green-400" : "text-red-400"
          }`}
        >
          {signal.outcome}
        </div>
      </div>

      {/* PRICE PROOF */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-white/50 mb-1">Entry</div>
          <div className="font-mono text-lg">
            ${entry.toFixed(2)}
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-3">
          <div className="text-white/50 mb-1">Exit</div>
          <div className="font-mono text-lg">
            ${exit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* PNL */}
      <div
        className={`text-sm font-bold ${
          pnl >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        PnL: {pnl >= 0 ? "+" : ""}
        {pnl.toFixed(2)} ({pnlPct}%)
      </div>

      {/* TIME */}
      <div className="text-xs text-white/50">
        Resolved at{" "}
        {new Date(signal.resolvedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

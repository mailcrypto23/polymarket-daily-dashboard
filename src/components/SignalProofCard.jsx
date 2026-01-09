export default function SignalProofCard({ signal }) {
  return (
    <div className="rounded-xl bg-black/40 p-4 space-y-2">
      <div className="flex justify-between">
        <span>{signal.symbol}</span>
        <span
          className={
            signal.outcome === "WIN"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {signal.outcome}
        </span>
      </div>

      <div className="text-xs text-white/60">
        Entry: {signal.entryPrice}
      </div>
      <div className="text-xs text-white/60">
        Exit: {signal.exitPrice}
      </div>

      <div className="text-xs text-white/40">
        Resolved at {new Date(signal.resolvedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}

import { explainConfidence } from "./SignalConfidence";

const TF = 15 * 60 * 1000;

export default function SignalCard({ signal, onDecision }) {
  const remaining = Math.max(0, signal.resolveAt - Date.now());
  const conf = explainConfidence({
    confidence: signal.confidence,
    remainingMs: remaining,
    tfMs: TF
  });

  const entryState =
    remaining <= 0
      ? "LOCKED"
      : remaining > TF * 0.6
      ? "SAFE"
      : remaining > TF * 0.25
      ? "RISKY"
      : "LATE";

  const tradable =
    signal.confidence >= 70 &&
    entryState === "SAFE" &&
    signal.outcome === "pending";

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{signal.question}</div>
          <div className="text-xs opacity-60">
            Resolves in {Math.ceil(remaining / 1000)}s
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">{signal.confidence}%</div>
          <div className={`text-xs ${conf.color}`}>{conf.label}</div>
        </div>
      </div>

      <div className="text-xs opacity-60">{conf.reason}</div>

      {signal.outcome !== "pending" && (
        <div
          className={`text-sm font-semibold ${
            signal.outcome === "win"
              ? "text-green-400"
              : signal.outcome === "loss"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          Resolved: {signal.outcome.toUpperCase()} · PnL {signal.pnl?.toFixed(2)}
        </div>
      )}

      <div className="flex justify-between pt-2 border-t border-white/10">
        <div className="text-xs">
          Trade allowed:{" "}
          <span className={tradable ? "text-green-400" : "text-red-400"}>
            {tradable ? "YES" : "NO"}
          </span>
        </div>

        <div className="space-x-2">
          <button
            disabled={!tradable}
            onClick={() => onDecision(signal.id, "ENTER")}
            className={`px-3 py-1 text-xs rounded ${
              tradable
                ? "bg-green-600"
                : "bg-white/10 opacity-40 cursor-not-allowed"
            }`}
          >
            ENTER
          </button>

          <button
            onClick={() => onDecision(signal.id, "SKIP")}
            className="px-3 py-1 text-xs rounded bg-red-600"
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}

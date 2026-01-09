import { explainConfidence } from "./SignalConfidence";

const TF = 15 * 60 * 1000;

export default function SignalCard({ signal, onDecision }) {
  if (
    !signal ||
    typeof signal.resolveAt !== "number" ||
    typeof signal.confidence !== "number"
  ) {
    return null;
  }

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

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-white font-semibold">
            {signal.market || "Unknown Market"}
          </div>
          <div className="text-xs text-white/50">
            Bias: <span className="font-bold">{signal.bias || "—"}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold">{signal.confidence}%</div>
          <div className={`text-xs ${conf.color}`}>{conf.label}</div>
        </div>
      </div>

      <div className="text-xs text-white/50">{conf.reason}</div>

      <div className="flex justify-between items-center pt-2 border-t border-white/10">
        <div className="text-xs">
          Entry Window:{" "}
          <span className="font-bold text-white">{entryState}</span>
        </div>

        <div className="space-x-2">
          <button
            disabled={entryState !== "SAFE"}
            onClick={() => onDecision(signal.id, "ENTER")}
            className={`px-3 py-1 text-xs rounded ${
              entryState === "SAFE"
                ? "bg-green-600"
                : "bg-white/10 text-white/30 cursor-not-allowed"
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

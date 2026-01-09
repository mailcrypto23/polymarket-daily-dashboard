export default function SignalCard({ signal, onDecision }) {
  const now = Date.now();

  const safe =
    typeof signal.confidence === "number" &&
    signal.confidence >= 70 &&
    now < signal.resolveAt;

  const remaining = Math.max(
    0,
    Math.floor((signal.resolveAt - now) / 1000)
  );

  return (
    <div className="rounded-xl bg-white/5 p-4 space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="font-semibold">
          {signal.symbol} · 15m
        </div>
        <div
          className={`text-sm ${
            safe ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {safe ? "SAFE" : "LOCKED"}
        </div>
      </div>

      {/* CONFIDENCE */}
      <div className="flex justify-between text-sm">
        <span>Confidence</span>
        <span className="font-bold">
          {signal.confidence ?? "—"}%
        </span>
      </div>

      {/* TIMER */}
      <div className="text-xs text-white/60">
        Resolves in: {remaining}s
      </div>

      {/* ACTION */}
      <div className="flex gap-2">
        <button
          disabled={!safe}
          onClick={() => onDecision(signal.id, "ENTER")}
          className={`flex-1 py-2 rounded ${
            safe
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          ENTER
        </button>

        <button
          onClick={() => onDecision(signal.id, "SKIP")}
          className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          SKIP
        </button>
      </div>
    </div>
  );
}

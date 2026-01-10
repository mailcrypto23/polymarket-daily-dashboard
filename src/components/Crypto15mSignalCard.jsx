import { useCountdown } from "../hooks/useCountdown";

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const entry = useCountdown(signal.entryClosesAt);

  const entryOpen = !entry.isExpired;
  const resolved = resolve.isExpired;

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 p-4 shadow-lg relative">

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-white text-sm">
            {signal.symbol} Up or Down · 15m
          </h3>
          <p className="text-xs text-white/70">
            Signal @ {new Date(signal.signalAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {signal.confidence}%
          </div>
          <div className="text-xs text-white/70">
            {signal.direction}
          </div>
        </div>
      </div>

      {/* Resolve Timer */}
      <div
        className={`text-xs mb-2 ${
          resolve.isUrgent ? "text-red-400 font-semibold" : "text-white/70"
        }`}
      >
        Resolve in {resolve.label}
      </div>

      {/* Entry Status */}
      <div className="text-xs mb-3">
        {entryOpen ? (
          <span className="text-green-400">
            ENTRY OPEN · closes in {entry.label}
          </span>
        ) : (
          <span className="text-white/40">ENTRY LOCKED</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          disabled={!entryOpen}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            entryOpen
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {entryOpen ? "YES" : "ENTRY LOCKED"}
        </button>

        <button
          disabled={!entryOpen}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            entryOpen
              ? "bg-red-500 hover:bg-red-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {entryOpen ? "NO" : "ENTRY LOCKED"}
        </button>
      </div>

      {/* Resolved Overlay */}
      {resolved && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
          RESOLVED
        </div>
      )}
    </div>
  );
}

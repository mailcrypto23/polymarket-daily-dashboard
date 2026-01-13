import { useCountdown } from "../hooks/useCountdown";
import {
  enterSignal,
  skipSignal,
} from "../engine/Crypto15mSignalEngine";

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const entry = useCountdown(signal.entryClosesAt);

  const entryOpen = !entry.isExpired;
  const resolved = resolve.isExpired;

  /* ================= VISUAL STATES ================= */

  const actionTaken = signal.userAction === "ENTER"
    ? "ENTERED"
    : signal.userAction === "SKIP"
    ? "SKIPPED"
    : null;

  const edge = signal.edge ?? 0;

  const edgeColor =
    edge >= 0.06
      ? "bg-green-500/20 text-green-300"
      : edge >= 0.02
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-red-500/20 text-red-300";

  const regimeLabel = signal.mispriced
    ? "FAVORABLE REGIME"
    : "CHOP / NO TRADE";

  const regimeColor = signal.mispriced
    ? "bg-green-600/20 text-green-300"
    : "bg-red-600/20 text-red-300";

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 p-4 shadow-lg relative">

      {/* REGIME BANNER */}
      <div className={`text-xs mb-2 px-2 py-1 rounded ${regimeColor}`}>
        {regimeLabel}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-white text-sm">
            {signal.symbol} · 15m
          </h3>
          <p className="text-xs text-white/70">
            Signal @ {new Date(signal.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {(signal.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-white/70">
            {signal.direction}
          </div>
        </div>
      </div>

      {/* EDGE BADGE */}
      {typeof signal.edge === "number" && (
        <div className={`inline-block text-xs px-2 py-1 rounded mb-2 ${edgeColor}`}>
          Edge {(edge * 100).toFixed(1)}%
        </div>
      )}

      {/* RESOLVE TIMER */}
      <div
        className={`text-xs mb-2 ${
          resolve.isUrgent ? "text-red-400 font-semibold" : "text-white/70"
        }`}
      >
        🔥 Resolve in {resolve.label}
      </div>

      {/* ENTRY STATUS */}
      <div className="text-xs mb-3">
        {entryOpen ? (
          <span className="text-green-400">
            ENTRY OPEN · closes in {entry.label}
          </span>
        ) : (
          <span className="text-white/40">ENTRY LOCKED</span>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mb-3">
        <button
          disabled={!entryOpen || actionTaken}
          onClick={() => enterSignal(signal.symbol)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            actionTaken === "ENTERED"
              ? "bg-green-700 text-white"
              : entryOpen
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {actionTaken === "ENTERED" ? "ENTERED" : "YES"}
        </button>

        <button
          disabled={!entryOpen || actionTaken}
          onClick={() => skipSignal(signal.symbol)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            actionTaken === "SKIPPED"
              ? "bg-red-700 text-white"
              : entryOpen
              ? "bg-red-500 hover:bg-red-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {actionTaken === "SKIPPED" ? "SKIPPED" : "NO"}
        </button>
      </div>

      {/* WHY THIS TRADE — HOVER EXPLAINER */}
      <div className="relative group text-xs text-white/60 cursor-help mb-3">
        Why this trade?

        <div className="
          absolute bottom-full left-0 mb-2 w-80
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none z-20
        ">
          <div className="
            bg-black/80 backdrop-blur
            border border-white/10
            rounded-lg p-3 shadow-xl
            text-xs text-gray-200
          ">
            {(signal.explanation?.length
              ? signal.explanation
              : ["Explanation pending — market odds still loading."]
            ).map((line, i) => (
              <div key={i} className="mb-1 last:mb-0">
                • {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEBUG ROW */}
      <div className="text-[10px] text-white/40 border-t border-white/10 pt-2">
        <div>Market Prob: {signal.marketProbability?.toFixed(3) ?? "—"}</div>
        <div>Edge: {signal.edge?.toFixed(4) ?? "—"}</div>
        <div>PnL: {signal.pnl?.toFixed(4) ?? "0.0000"}</div>
        <div>User Action: {signal.userAction ?? "NONE"}</div>
      </div>

      {/* RESOLVED OVERLAY */}
      {resolved && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
          RESOLVED · PnL {signal.pnl >= 0 ? "+" : ""}
          {signal.pnl}
        </div>
      )}
    </div>
  );
}

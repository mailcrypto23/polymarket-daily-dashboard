import { useCountdown } from "../hooks/useCountdown";
import { enterSignal, skipSignal } from "../engine/Crypto15mSignalEngine";
import { getTradeDecision } from "../engine/tradeDecisionEngine";
import { getDrawdownState } from "../engine/drawdownGuard";
import { useState } from "react";

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const entry = useCountdown(signal.entryClosesAt);

  const entryOpen = !entry.isExpired && !signal.userAction;
  const resolved = resolve.isExpired;

  const drawdownState = getDrawdownState();
  const decision = getTradeDecision(signal, drawdownState);

  const [clicked, setClicked] = useState(signal.userAction);

  function onYes() {
    if (decision.status !== "ALLOWED") return;
    const ok = enterSignal(signal.symbol);
    if (ok) setClicked("ENTER");
  }

  function onNo() {
    if (decision.status !== "ALLOWED") return;
    const ok = skipSignal(signal.symbol);
    if (ok) setClicked("SKIP");
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 p-4 shadow-lg relative">

      {/* Header */}
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

      {/* Resolve Timer */}
      <div
        className={`text-xs mb-2 ${
          resolve.isUrgent
            ? "text-red-400 font-semibold"
            : "text-white/70"
        }`}
      >
        Resolve in {resolve.label}
      </div>

      {/* Entry Status */}
      <div className="text-xs mb-2">
        {entryOpen ? (
          <span className="text-green-400">
            ENTRY OPEN · closes in {entry.label}
          </span>
        ) : (
          <span className="text-white/40">ENTRY LOCKED</span>
        )}
      </div>

      {/* Trade Decision Banner */}
      <div className="text-xs mb-3 font-semibold">
        {decision.status === "ALLOWED" && (
          <span className="text-green-400">🟢 Trade Allowed</span>
        )}
        {decision.reason === "DRAWDOWN" && (
          <span className="text-red-400">
            ⛔ Blocked: Drawdown limit reached
          </span>
        )}
        {decision.reason === "REGIME" && (
          <span className="text-yellow-400">
            ⚠ Blocked: Low-volatility regime
          </span>
        )}
        {decision.reason === "NO_EDGE" && (
          <span className="text-white/50">
            ⚪ Blocked: No positive edge
          </span>
        )}
        {decision.reason === "ENTRY_CLOSED" && (
          <span className="text-white/40">
            ⚫ Blocked: Entry window closed
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onYes}
          disabled={decision.status !== "ALLOWED"}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            clicked === "ENTER"
              ? "bg-green-700 text-black"
              : decision.status === "ALLOWED"
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "ENTER" ? "ENTERED ✓" : "YES"}
        </button>

        <button
          onClick={onNo}
          disabled={decision.status !== "ALLOWED"}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            clicked === "SKIP"
              ? "bg-red-700 text-black"
              : decision.status === "ALLOWED"
              ? "bg-red-500 hover:bg-red-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "SKIP" ? "SKIPPED" : "NO"}
        </button>
      </div>

      {/* WHY THIS TRADE */}
      <div className="relative group text-xs text-white/60 cursor-help">
        Why this trade?

        <div className="absolute bottom-full left-0 mb-2 w-80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-black/80 backdrop-blur border border-white/10 rounded-lg p-3 shadow-xl text-xs text-gray-200">
            {signal.explanation?.map((line, i) => (
              <div key={i} className="mb-1">{line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Debug Row */}
      <div className="mt-2 text-[10px] text-white/40">
        Edge: {signal.edge?.toFixed(3) ?? "—"} | Kelly:{" "}
        {signal.kellyFraction
          ? (signal.kellyFraction * 100).toFixed(1)
          : "0.0"}
        %
      </div>

      {/* Resolved Overlay */}
      {resolved && (
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
          RESOLVED
        </div>
      )}
    </div>
  );
}

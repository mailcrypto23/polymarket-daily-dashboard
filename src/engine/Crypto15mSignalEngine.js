import { useCountdown } from "../hooks/useCountdown";
import { enterSignal, skipSignal } from "../engine/Crypto15mSignalEngine";
import { useState } from "react";

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const entry = useCountdown(signal.entryClosesAt);

  const entryAllowed =
    !entry.isExpired &&
    !signal.userAction &&
    signal.regimeOK &&
    !signal.drawdownBlocked &&
    signal.mispriced;

  const resolved = resolve.isExpired;
  const [clicked, setClicked] = useState(signal.userAction);

  function onYes() {
    if (!entryAllowed) return;
    const ok = enterSignal(signal.symbol);
    if (ok) setClicked("ENTER");
  }

  function onNo() {
    if (!entryAllowed) return;
    const ok = skipSignal(signal.symbol);
    if (ok) setClicked("SKIP");
  }

  /* ===== TRADE STATUS LABEL ===== */
  let statusLabel = "✅ Tradable";
  if (signal.drawdownBlocked) statusLabel = "⛔ Drawdown limit reached";
  else if (!signal.regimeOK) statusLabel = "⚠ Low-volatility regime";
  else if (!signal.mispriced) statusLabel = "⚠ No positive edge";
  else if (!entryAllowed) statusLabel = "⏳ Entry window closed";

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 p-4 shadow-lg relative">

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-white text-sm">
            {signal.symbol} · 15m
          </h3>
          <p className="text-xs text-white/60">
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
            : "text-white/60"
        }`}
      >
        Resolve in {resolve.label}
      </div>

      {/* Status Banner */}
      <div className="mb-2 text-xs">
        <span
          className={
            statusLabel.startsWith("✅")
              ? "text-green-400"
              : statusLabel.startsWith("⚠")
              ? "text-yellow-400"
              : "text-red-400"
          }
        >
          {statusLabel}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onYes}
          disabled={!entryAllowed}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            clicked === "ENTER"
              ? "bg-green-700 text-black"
              : entryAllowed
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "ENTER" ? "ENTERED ✓" : "YES"}
        </button>

        <button
          onClick={onNo}
          disabled={!entryAllowed}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
            clicked === "SKIP"
              ? "bg-red-700 text-black"
              : entryAllowed
              ? "bg-red-500 hover:bg-red-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "SKIPPED" ? "SKIPPED" : "NO"}
        </button>
      </div>

      {/* WHY THIS TRADE */}
      <div className="relative group text-xs text-white/60 cursor-help">
        Why this trade?

        <div className="absolute bottom-full left-0 mb-2 w-80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-black/80 backdrop-blur border border-white/10 rounded-lg p-3 shadow-xl text-xs text-gray-200">
            {signal.explanation?.map((line, i) => (
              <div key={i} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Debug Row */}
      <div className="mt-2 text-[10px] text-white/40">
        Edge: {signal.edge?.toFixed(3) ?? "—"} · Kelly:{" "}
        {(signal.kellyFraction * 100).toFixed(1)}%
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

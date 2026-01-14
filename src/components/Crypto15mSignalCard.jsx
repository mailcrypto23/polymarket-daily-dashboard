import { useCountdown } from "../hooks/useCountdown";
import { enterSignal, skipSignal } from "../engine/Crypto15mSignalEngine";
import { getTradeDecision } from "../engine/tradeDecisionEngine";
import { getDrawdownState } from "../engine/drawdownGuard";
import { useState } from "react";

/* =========================================================
   Crypto15mSignalCard — FINAL (Sequential Q&A + Guarded)
   - Uses tradeDecisionEngine (single source of truth)
   - Forces step-by-step review before YES / NO
   - No duplicated risk logic
========================================================= */

const QA_STEPS = [
  "CONFIDENCE",
  "EDGE",
  "REGIME",
  "RISK",
];

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const entry = useCountdown(signal.entryClosesAt);

  const resolved = resolve.isExpired;

  const drawdownState = getDrawdownState();
  const decision = getTradeDecision(signal, drawdownState);

  const [clicked, setClicked] = useState(signal.userAction);
  const [step, setStep] = useState(0);

  const reviewComplete = step >= QA_STEPS.length;
  const canAct =
    reviewComplete && decision.status === "ALLOWED";

  function nextStep() {
    setStep(s => Math.min(s + 1, QA_STEPS.length));
  }

  function onYes() {
    if (!canAct) return;
    const ok = enterSignal(signal.symbol);
    if (ok) setClicked("ENTER");
  }

  function onNo() {
    if (!canAct) return;
    const ok = skipSignal(signal.symbol);
    if (ok) setClicked("SKIP");
  }

  return (
    <div className="rounded-xl bg-black/60 border border-white/10 p-4 shadow-lg relative">

      {/* HEADER */}
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
          <div className="text-xs text-white/60">
            {signal.direction}
          </div>
        </div>
      </div>

      {/* TIMER */}
      <div
        className={`text-xs mb-2 ${
          resolve.isUrgent
            ? "text-red-400 font-semibold"
            : "text-white/60"
        }`}
      >
        Resolve in {resolve.label}
      </div>

      {/* DECISION STATUS */}
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

      {/* ===== SEQUENTIAL Q&A ===== */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] text-white/40">
          Review {Math.min(step, QA_STEPS.length)} / {QA_STEPS.length}
        </div>

        {step >= 0 && (
          <QAItem title="1. Confidence">
            Model confidence is{" "}
            {(signal.confidence * 100).toFixed(1)}%.
          </QAItem>
        )}

        {step >= 1 && (
          <QAItem title="2. Market Edge">
            Edge detected:{" "}
            {signal.edge
              ? (signal.edge * 100).toFixed(1) + "%"
              : "—"}
          </QAItem>
        )}

        {step >= 2 && (
          <QAItem title="3. Market Regime">
            {signal.regimeOK
              ? "Regime acceptable (trending)."
              : "Low volatility (chop)."}
          </QAItem>
        )}

        {step >= 3 && (
          <QAItem title="4. Risk Controls">
            {drawdownState.blocked
              ? "Drawdown limit breached."
              : "Drawdown within limits."}
            <br />
            Kelly suggestion:{" "}
            {(signal.kellyFraction * 100).toFixed(1)}%
          </QAItem>
        )}

        {step < QA_STEPS.length && (
          <button
            onClick={nextStep}
            className="w-full rounded-md bg-white/10 hover:bg-white/20 text-white text-xs py-2"
          >
            Next
          </button>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={onYes}
          disabled={!canAct}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            clicked === "ENTER"
              ? "bg-green-700 text-black"
              : canAct
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "ENTER" ? "ENTERED ✓" : "YES"}
        </button>

        <button
          onClick={onNo}
          disabled={!canAct}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
            clicked === "SKIP"
              ? "bg-red-700 text-black"
              : canAct
              ? "bg-red-500 hover:bg-red-600 text-black"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {clicked === "SKIP" ? "SKIPPED" : "NO"}
        </button>
      </div>

      {/* RESOLVED OVERLAY */}
      {resolved && (
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
          RESOLVED
        </div>
      )}
    </div>
  );
}

function QAItem({ title, children }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/40 p-2 text-xs text-white/80">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-white/60">{children}</div>
    </div>
  );
}

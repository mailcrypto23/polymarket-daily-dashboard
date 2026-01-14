import { useCountdown } from "../hooks/useCountdown";
import { useState } from "react";

/* =========================================================
   Crypto15mSignalCard — ANALYTICS ONLY (Approval Safe)
   - No execution
   - No trade engines
   - No wallet access
========================================================= */

const QA_STEPS = ["CONFIDENCE", "EDGE", "REGIME", "RISK"];

export default function Crypto15mSignalCard({ signal }) {
  const resolve = useCountdown(signal.resolveAt);
  const resolved = resolve.isExpired;

  const [step, setStep] = useState(0);
  const reviewComplete = step >= QA_STEPS.length;

  function nextStep() {
    setStep((s) => Math.min(s + 1, QA_STEPS.length));
  }

  function copyThesis() {
    navigator.clipboard.writeText(
      `${signal.symbol} · ${signal.direction}
Confidence: ${(signal.confidence * 100).toFixed(1)}%
Edge: ${signal.edge ? (signal.edge * 100).toFixed(1) + "%" : "—"}
Regime: ${signal.regimeOK ? "Trending" : "Low Volatility"}
Resolve in ${resolve.label}`
    );
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

      {/* ANALYTICS DISCLAIMER */}
      <div className="text-[11px] text-white/40 mb-3">
        Analytics only · No execution · No wallet access
      </div>

      {/* ===== SEQUENTIAL REVIEW ===== */}
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
          <QAItem title="4. Risk Context">
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

      {/* ACTIONS (SAFE) */}
      <div className="flex gap-3">
        <a
          href={`https://polymarket.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold text-center"
        >
          View Market on Polymarket ↗
        </a>

        <button
          onClick={copyThesis}
          className="flex-1 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold"
        >
          Copy Thesis
        </button>
      </div>

      {/* RESOLVED */}
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

import { useEffect, useRef, useState } from "react";
import {
  getActive15mSignals,
  enterSignal,
  skipSignal,
} from "../engine/Crypto15mSignalEngine";

import ConfidenceExplanation from "./ConfidenceExplanation";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];

function formatTime(ms) {
  if (ms <= 0) return "0:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Crypto15mSignalGrid() {
  const [signals, setSignals] = useState({});
  const containerRef = useRef(null);

  // Live signal refresh
  useEffect(() => {
    const tick = () => {
      setSignals(getActive15mSignals());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll newest signal into view
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [signals]);

  return (
    <div
      ref={containerRef}
      className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
    >
      {ASSETS.map(asset => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = s.resolveAt - Date.now();
        const locked = !s.entryOpen;
        const confidencePct = Math.round(s.confidence * 100);
        const highConfidence = s.confidence >= 0.75;

        return (
          <div
            key={s.id}
            className={`
              relative min-w-[260px] rounded-xl p-4
              bg-gradient-to-br from-purple-700 to-purple-900
              border border-purple-400/20
              shadow-lg space-y-3
              ${highConfidence ? "ring-2 ring-purple-400/40 glow" : ""}
            `}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white text-sm">
                  {asset} · 15m
                </h3>
                <p className="text-xs text-purple-200">
                  Resolve in {formatTime(remaining)}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {confidencePct}%
                </div>
                <div className="text-xs text-purple-200">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* Entry status */}
            <div>
              {locked ? (
                <span className="text-white/50 text-xs font-semibold">
                  ENTRY LOCKED
                </span>
              ) : (
                <span className="text-green-300 text-xs font-semibold animate-pulse">
                  ENTRY OPEN
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className={`flex-1 py-2 rounded-md text-xs font-semibold transition ${
                  locked
                    ? "bg-white/10 text-white/30"
                    : "bg-green-500 text-black hover:bg-green-400"
                }`}
              >
                YES
              </button>

              <button
                disabled={locked}
                onClick={() => skipSignal(asset)}
                className={`flex-1 py-2 rounded-md text-xs font-semibold transition ${
                  locked
                    ? "bg-white/10 text-white/30"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                NO
              </button>
            </div>

            {/* Confidence explanation */}
            <ConfidenceExplanation signal={s} />
          </div>
        );
      })}
    </div>
  );
}

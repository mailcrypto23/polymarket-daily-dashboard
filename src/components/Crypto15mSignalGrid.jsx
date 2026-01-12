import { useEffect, useRef, useState } from "react";
import {
  getActive15mSignals,
  enterSignal,
  skipSignal,
} from "../engine/Crypto15mSignalEngine";

import ConfidenceExplanation from "./ConfidenceExplanation";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TOTAL_WINDOW = 15 * 60 * 1000;

function formatTime(ms) {
  if (ms <= 0) return "0:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Crypto15mSignalGrid() {
  const [signals, setSignals] = useState({});
  const stripRef = useRef(null);

  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Auto-scroll newest signal
  useEffect(() => {
    if (stripRef.current) {
      stripRef.current.scrollTo({
        left: stripRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [signals]);

  return (
    <div
      ref={stripRef}
      className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
    >
      {ASSETS.map(asset => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = s.resolveAt - Date.now();
        const elapsedRatio = 1 - Math.min(1, remaining / TOTAL_WINDOW);
        const locked = !s.entryOpen;
        const confidencePct = Math.round(s.confidence * 100);

        return (
          <div
            key={s.id}
            className="
              min-w-[260px]
              snap-start
              rounded-xl
              p-4
              bg-gradient-to-br from-purple-700/90 to-purple-900/90
              border border-white/10
              shadow-[0_12px_40px_rgba(168,85,247,0.35)]
              transition-transform duration-200
              hover:-translate-y-0.5
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {asset} · 15m
                </h3>

                {/* 🔥 RESOLVE TIMER */}
                <p className="text-xs font-semibold text-red-400 flex items-center gap-1">
                  🔥 Resolve in {formatTime(remaining)}
                </p>
              </div>

              {/* CONFIDENCE */}
              <div className="text-right">
                <div
                  className="text-xl font-bold text-white glow"
                  style={{
                    opacity: 1 - elapsedRatio * 0.4,
                    transform: `scale(${1 - elapsedRatio * 0.06})`,
                  }}
                >
                  {confidencePct}%
                </div>
                <div className="text-xs text-purple-200">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* ENTRY STATUS */}
            <div className="text-xs font-semibold mt-1">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-400 animate-pulse">
                  ENTRY OPEN
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-2">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold ${
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
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold ${
                  locked
                    ? "bg-white/10 text-white/30"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                NO
              </button>
            </div>

            {/* CONFIDENCE BREAKDOWN */}
            <ConfidenceExplanation signal={s} />

            {/* MICRO ACTIONS */}
            <div className="flex justify-between text-xs mt-2">
              <button
                className="text-white/50 hover:text-white underline"
                title="Momentum, trend, volatility & liquidity aligned"
              >
                Why this signal?
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} 15m ${s.direction} | Confidence ${confidencePct}% | Momentum + Trend + Liquidity aligned`
                  )
                }
                className="text-purple-300 hover:text-purple-200"
              >
                Copy thesis
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

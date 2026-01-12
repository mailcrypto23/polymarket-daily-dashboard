// src/components/Crypto15mSignalGrid.jsx

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
  const scrollRef = useRef(null);

  /* 🔁 Live updates */
  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  /* 🔥 Auto-scroll to newest signal */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [signals]);

  return (
    <div
      ref={scrollRef}
      className="
        flex gap-4
        overflow-x-auto
        pb-3
        scrollbar-hide
        snap-x snap-mandatory
      "
    >
      {ASSETS.map(asset => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = s.resolveAt - Date.now();
        const locked = !s.entryOpen;

        return (
          <div
            key={s.id}
            className={`
              snap-start
              min-w-[260px]
              rounded-xl
              p-4
              space-y-3
              bg-gradient-to-br from-purple-700 to-purple-900
              border border-white/10
              shadow-lg
              ${s.confidence >= 0.75 ? "glow" : ""}
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold">
                  {asset} · 15m
                </h3>
                <p className="text-xs text-purple-200">
                  Resolve in {formatTime(remaining)}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold">
                  {Math.round(s.confidence * 100)}%
                </div>
                <div className="text-xs text-purple-200">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* ENTRY STATUS */}
            <div className="text-xs font-semibold">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-300 animate-pulse">
                  ENTRY OPEN
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className={`flex-1 py-2 rounded-md text-xs font-semibold ${
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
                className={`flex-1 py-2 rounded-md text-xs font-semibold ${
                  locked
                    ? "bg-white/10 text-white/30"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                NO
              </button>
            </div>

            {/* 🧠 WHY THIS SIGNAL (HOVER REVEAL) */}
            <div className="group">
              <div className="text-xs text-purple-200 cursor-help">
                Why this signal?
              </div>
              <div className="hidden group-hover:block mt-2">
                <ConfidenceExplanation signal={s} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

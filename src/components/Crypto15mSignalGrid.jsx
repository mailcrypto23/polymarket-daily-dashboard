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
  const stripRef = useRef(null);

  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  // 🔥 auto-scroll newest signal
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
      className="
        grid
        grid-cols-[repeat(auto-fit,minmax(300px,1fr))]
        gap-4
        w-full
        scrollbar-hide
        snap-x snap-mandatory
        pb-3
      "
    >
      {ASSETS.map((asset) => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = s.resolveAt - Date.now();
        const locked = !s.entryOpen;
        const confidencePct = Math.round(s.confidence * 100);

        return (
          <div
            key={s.id}
            className="
              snap-start
              card
              p-5
              space-y-4
              bg-gradient-to-br from-purple-700/90 to-purple-900/95
              relative
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <div className="text-base font-semibold tracking-tight">
                  {asset} · 15m
                </div>

                <div className="text-sm text-red-400 font-semibold flex items-center gap-1 fire">
                  🔥 Resolve in {formatTime(remaining)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold leading-none">
                  {confidencePct}%
                </div>
                <div className="text-sm uppercase opacity-70">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* ENTRY STATE */}
            <div className="text-sm font-semibold">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-400 animate-pulse">
                  ENTRY OPEN
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className="
                  flex-1 py-2 rounded-lg
                  bg-green-500 text-black
                  text-sm font-bold
                  disabled:opacity-30
                "
              >
                YES
              </button>
              <button
                disabled={locked}
                onClick={() => skipSignal(asset)}
                className="
                  flex-1 py-2 rounded-lg
                  bg-red-500 text-white
                  text-sm font-bold
                  disabled:opacity-30
                "
              >
                NO
              </button>
            </div>

            {/* CONFIDENCE */}
            <div className="decay bg-black/40 rounded-lg p-3">
              <ConfidenceExplanation signal={s} />
            </div>

            {/* MICRO ACTIONS */}
            <div className="flex justify-between text-sm text-white/50 pt-1">
              <span className="cursor-help hover:text-white">
                Why this signal?
              </span>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} ${s.direction} · ${confidencePct}% confidence\nResolve in ${formatTime(
                      remaining
                    )}`
                  )
                }
                className="hover:text-white"
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

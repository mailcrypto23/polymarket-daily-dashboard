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

  // auto-scroll newest
  useEffect(() => {
    stripRef.current?.scrollTo({
      left: stripRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [signals]);

  return (
    <div
      ref={stripRef}
      className="
        flex gap-4
        overflow-x-auto scrollbar-hide
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
            className="
              snap-start
              flex-1
              min-w-[320px]
              max-w-[360px]
              rounded-xl
              p-5
              bg-black/80
              border border-white/10
              shadow-xl
              space-y-4
              glow
            "
          >
            {/* Header */}
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {asset} · 15m
                </div>
                <div className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                  🔥 Resolve in {formatTime(remaining)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {Math.round(s.confidence * 100)}%
                </div>
                <div className="text-xs opacity-70">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* Entry */}
            <div className="text-xs font-semibold">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-400 animate-pulse">
                  ENTRY OPEN
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className="flex-1 py-2 rounded bg-green-500 text-black text-sm font-bold disabled:opacity-30"
              >
                YES
              </button>
              <button
                disabled={locked}
                onClick={() => skipSignal(asset)}
                className="flex-1 py-2 rounded bg-red-500 text-white text-sm font-bold disabled:opacity-30"
              >
                NO
              </button>
            </div>

            <ConfidenceExplanation signal={s} />

            {/* Footer */}
            <div className="flex justify-between text-xs text-white/50">
              <span>Why this signal?</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} ${s.direction} · ${Math.round(
                      s.confidence * 100
                    )}% confidence`
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

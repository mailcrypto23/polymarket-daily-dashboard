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

  // 🔥 auto-scroll newest
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
        flex gap-4
        overflow-x-auto scrollbar-hide
        snap-x snap-mandatory
        pb-3
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
              min-w-[260px]
              card
              p-4
              bg-gradient-to-br from-purple-700 to-purple-900
              space-y-3
              decay-glow
            "
          >
            {/* Header */}
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-semibold">{asset} · 15m</div>
                <div className="text-xs text-red-400 flex items-center gap-1">
                  🔥 Resolve in {formatTime(remaining)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {Math.round(s.confidence * 100)}%
                </div>
                <div className="text-xs opacity-70">{s.direction}</div>
              </div>
            </div>

            {/* Entry */}
            <div className="text-xs font-semibold">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-400 animate-pulse">ENTRY OPEN</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                disabled={locked}
                onClick={() => enterSignal(asset)}
                className="flex-1 py-1.5 rounded bg-green-500 text-black text-xs font-bold disabled:opacity-30"
              >
                YES
              </button>
              <button
                disabled={locked}
                onClick={() => skipSignal(asset)}
                className="flex-1 py-1.5 rounded bg-red-500 text-white text-xs font-bold disabled:opacity-30"
              >
                NO
              </button>
            </div>

            <ConfidenceExplanation signal={s} />

            {/* Micro actions */}
            <div className="flex justify-between text-xs text-white/40 pt-1">
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

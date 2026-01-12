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

  return (
    <div
      ref={stripRef}
      className="
        grid
        w-full
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
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
              rounded-xl
              p-5
              space-y-4
              bg-gradient-to-br from-black/80 to-black/95
              border border-white/10
            "
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <div className="text-base font-semibold">
                  {asset} · 15m
                </div>
                <div className="text-sm font-semibold text-red-400">
                  🔥 Resolve in {formatTime(remaining)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold">
                  {confidencePct}%
                </div>
                <div className="text-sm opacity-70">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* ENTRY */}
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
                className="flex-1 py-2 rounded-lg bg-green-500 text-black font-bold text-sm disabled:opacity-30"
              >
                YES
              </button>
              <button
                disabled={locked}
                onClick={() => skipSignal(asset)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold text-sm disabled:opacity-30"
              >
                NO
              </button>
            </div>

            {/* CONFIDENCE */}
            <div className="bg-black/40 rounded-lg p-3">
              <ConfidenceExplanation signal={s} />
            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-sm text-white/50">
              <span>Why this signal?</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} ${s.direction} · ${confidencePct}%`
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

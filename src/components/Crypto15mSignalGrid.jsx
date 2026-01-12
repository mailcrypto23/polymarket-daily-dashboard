// src/components/Crypto15mSignalGrid.jsx

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {ASSETS.map(asset => {
        const s = signals[asset];
        if (!s) return null;

        const remaining = s.resolveAt - Date.now();
        const locked = !s.entryOpen;
        const confidencePct = Math.round(s.confidence * 100);

        return (
          <div
            key={s.id}
            className={`
              min-w-[260px]
              rounded-xl
              p-4
              bg-gradient-to-br from-purple-700/90 to-purple-900/90
              border border-white/10
              shadow-lg
              space-y-3
              ${confidencePct >= 75 ? "ring-1 ring-purple-400/40" : ""}
            `}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {asset} · 15m
                </h3>
                <p className="text-xs text-purple-200">
                  Resolve in {formatTime(remaining)}
                </p>
              </div>

              <div className="text-right">
                <div
                  className={`text-xl font-bold ${
                    confidencePct >= 75
                      ? "text-green-300"
                      : "text-white"
                  }`}
                >
                  {confidencePct}%
                </div>
                <div className="text-xs text-purple-200">
                  {s.direction}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="text-xs font-semibold">
              {locked ? (
                <span className="text-white/40">ENTRY LOCKED</span>
              ) : (
                <span className="text-green-300 animate-pulse">
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

            {/* Confidence */}
            <ConfidenceExplanation signal={s} />
          </div>
        );
      })}
    </>
  );
}

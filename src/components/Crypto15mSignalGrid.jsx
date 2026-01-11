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
    const tick = () => {
      setSignals(getActive15mSignals());
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-10">
      {/* ✅ Single heading (duplicate title fixed) */}
      <h2 className="text-xl font-bold mb-4">
        🔥 High-Confidence Crypto 15-Minute Signals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ASSETS.map((asset) => {
          const s = signals[asset];
          if (!s) return null;

          const remaining = s.resolveAt - Date.now();
          const locked = !s.entryOpen;
          const urgent = remaining <= 3 * 60 * 1000;

          return (
            <div
              key={s.id}
              className="rounded-xl p-5 bg-gradient-to-br from-purple-700 to-purple-900 shadow-lg"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {asset} Up or Down · 15m
                  </h3>

                  <p
                    className={`text-xs mt-1 ${
                      urgent
                        ? "text-red-300 font-semibold"
                        : "text-purple-200"
                    }`}
                  >
                    Resolve in {formatTime(remaining)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {Math.round(s.confidence * 100)}%
                  </div>
                  <div className="text-xs text-purple-200">
                    {s.direction}
                  </div>
                </div>
              </div>

              {/* Entry Status */}
              <div className="mb-3">
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
              <div className="flex gap-3">
                <button
                  disabled={locked}
                  onClick={() => enterSignal(asset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                    ${
                      locked
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-green-500 text-black hover:bg-green-400"
                    }`}
                >
                  {locked ? "ENTRY LOCKED" : "YES"}
                </button>

                <button
                  disabled={locked}
                  onClick={() => skipSignal(asset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                    ${
                      locked
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-400"
                    }`}
                >
                  {locked ? "ENTRY LOCKED" : "NO"}
                </button>
              </div>

              {/* ✅ Confidence explanation panel */}
              <ConfidenceExplanation signal={s} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

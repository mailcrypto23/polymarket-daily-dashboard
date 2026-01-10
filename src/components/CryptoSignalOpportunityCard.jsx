import React, { useEffect, useState } from "react";

export default function CryptoSignalOpportunityCard({ signal, onEnter, onSkip }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeLeft = Math.max(0, Math.floor((signal.resolveAt - now) / 1000));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const entryOpen = now < signal.safeUntil;
  const confidencePct = Math.round(signal.confidence * 100);

  return (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-5 relative shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-white font-semibold">
            {signal.symbol} Up or Down · 15m
          </h3>
          <p className="text-xs text-purple-200">
            Resolve in {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>

        {/* Confidence Gauge */}
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {confidencePct}%
          </div>
          <div className="text-xs text-purple-200">
            {signal.bias === "UP" ? "Up" : "Down"}
          </div>
        </div>
      </div>

      {/* Entry State */}
      <div className="text-xs mb-3">
        {entryOpen ? (
          <span className="text-green-300 animate-pulse">
            ENTRY OPEN
          </span>
        ) : (
          <span className="text-red-300">
            ENTRY CLOSED
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          disabled={!entryOpen}
          onClick={() => onEnter(signal, "YES")}
          className={`flex-1 py-2 rounded-full font-semibold transition
            ${signal.bias === "UP"
              ? "bg-green-500 text-black"
              : "bg-purple-500 text-white"}
            ${entryOpen ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"}
          `}
        >
          YES
        </button>

        <button
          disabled={!entryOpen}
          onClick={() => onEnter(signal, "NO")}
          className={`flex-1 py-2 rounded-full font-semibold transition
            ${signal.bias === "DOWN"
              ? "bg-red-500 text-white"
              : "bg-purple-800 text-white"}
            ${entryOpen ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"}
          `}
        >
          NO
        </button>
      </div>
    </div>
  );
}

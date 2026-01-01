import React, { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_log";

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const update = () => setSignals(loadSignals());
    update();

    const i = setInterval(update, 5000); // refresh every 5s
    return () => clearInterval(i);
  }, []);

  const active = signals.filter(
    s => !s.outcome && Date.now() < s.resolveAt
  );

  return (
    <div className="bg-[#0b1220] rounded-xl p-5 border border-white/10">
      <h2 className="text-lg font-semibold text-white mb-4">
        ⏱️ Crypto 15-Minute Signals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {active.map((s, i) => {
          const remaining = Math.max(
            0,
            Math.floor((s.resolveAt - Date.now()) / 60000)
          );

          return (
            <div
              key={i}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="text-sm text-gray-400 mb-1">
                {s.market}
              </div>

              <div
                className={`text-2xl font-bold ${
                  s.side === "YES"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {s.side}
              </div>

              <div className="text-sm text-gray-300 mt-1">
                Confidence: {s.confidence}%
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Resolves in ~{remaining} min
              </div>
            </div>
          );
        })}

        {!active.length && (
          <div className="col-span-full text-center text-gray-500 py-6">
            Waiting for next 15-minute window…
          </div>
        )}
      </div>
    </div>
  );
}

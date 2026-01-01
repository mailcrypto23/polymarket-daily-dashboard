import React, { useMemo } from "react";

const STORAGE_KEY = "pm_signal_log";

function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function AccuracyChart() {
  const data = useMemo(() => {
    const signals = loadSignals().filter(
      s => s.outcome === "win" || s.outcome === "loss"
    );

    let wins = 0;
    return signals.map((s, i) => {
      if (s.outcome === "win") wins++;
      return {
        index: i + 1,
        accuracy: +(wins / (i + 1) * 100).toFixed(1)
      };
    });
  }, []);

  if (!data.length) {
    return (
      <div className="text-gray-400 text-sm">
        No resolved signals yet
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h3 className="text-sm text-gray-400 mb-2">
        Accuracy Over Time
      </h3>

      <div className="flex items-end gap-1 h-32">
        {data.map(d => (
          <div
            key={d.index}
            title={`${d.accuracy}%`}
            className="flex-1 bg-purple-500/70 rounded-sm"
            style={{ height: `${d.accuracy}%` }}
          />
        ))}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Rolling cumulative win-rate
      </div>
    </div>
  );
}

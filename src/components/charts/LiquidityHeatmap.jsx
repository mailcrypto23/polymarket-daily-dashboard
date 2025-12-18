import React, { useState } from "react";

const TIMEFRAMES = ["5m", "15m", "1h"];

// mock premium liquidity data
const generateHeatmap = () =>
  Array.from({ length: 5 }).map(() =>
    Array.from({ length: 12 }).map(() => ({
      price: (3000 + Math.random() * 500).toFixed(0),
      side: Math.random() > 0.5 ? "YES" : "NO",
      liquidity: (Math.random() * 2.5).toFixed(2),
      strength: Math.random() > 0.7 ? "Whale" : "Normal",
    }))
  );

export default function LiquidityHeatmap({ market }) {
  const [timeframe, setTimeframe] = useState("15m");
  const [data, setData] = useState(generateHeatmap());
  const [hover, setHover] = useState(null);

  const onTimeChange = (t) => {
    setTimeframe(t);
    setData(generateHeatmap());
  };

  return (
    <div className="relative">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Liquidity Heatmap</h3>

        {/* Legend */}
        <div className="text-[11px] text-white/70 flex items-center gap-1">
          <span>Low</span>
          <span className="w-3 h-3 bg-purple-900 rounded-sm" />
          <span className="w-3 h-3 bg-purple-700 rounded-sm" />
          <span className="w-3 h-3 bg-purple-500 rounded-sm" />
          <span className="w-3 h-3 bg-violet-400 rounded-sm" />
          <span className="w-3 h-3 bg-violet-300 rounded-sm shadow-[0_0_6px_rgba(168,85,247,0.9)]" />
          <span>High</span>
        </div>
      </div>

      {/* ===== TIME CONTROLS ===== */}
      <div className="flex gap-2 mb-3">
        {TIMEFRAMES.map((t) => (
          <button
            key={t}
            onClick={() => onTimeChange(t)}
            className={`px-3 py-1 text-xs rounded-full transition
              ${t === timeframe
                ? "bg-violet-600 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===== HEATMAP GRID ===== */}
      <div className="grid gap-2 animate-fadeIn">
        {data.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((cell, cIdx) => {
              const intensity = Math.min(1, cell.liquidity / 2.5);
              const isWhale = cell.strength === "Whale";

              return (
                <div
                  key={cIdx}
                  onMouseEnter={() => setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  className={`h-5 w-8 rounded-md cursor-pointer transition-all
                    ${isWhale ? "ring-2 ring-violet-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" : ""}
                  `}
                  style={{
                    background: `rgba(168,85,247,${0.25 + intensity})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* ===== TOOLTIP ===== */}
      {hover && (
        <div className="absolute right-4 bottom-4 bg-black/90 border border-white/10
                        text-xs rounded-lg p-3 space-y-1">
          <div>Price: <b>${hover.price}</b></div>
          <div>Side: <b>{hover.side}</b></div>
          <div>Liquidity: <b>${hover.liquidity}M</b></div>
          <div>
            Strength:{" "}
            <b className={hover.strength === "Whale" ? "text-violet-400" : ""}>
              {hover.strength}
            </b>
          </div>
        </div>
      )}
    </div>
  );
}

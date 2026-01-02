import { useState, useEffect } from "react";
import { deriveHeatmapSignal } from "../../utils/deriveHeatmapSignal";

const timeframes = ["5m", "15m", "1h"];

function generateHeatmap() {
  return Array.from({ length: 5 }).map(() =>
    Array.from({ length: 12 }).map(() => {
      const intensity = Math.random();
      return {
        price: (3200 + Math.random() * 40).toFixed(2),
        side: Math.random() > 0.5 ? "YES" : "NO",
        liquidity: `$${(Math.random() * 2 + 0.3).toFixed(2)}M`,
        strength:
          intensity > 0.7 ? "Strong" : intensity > 0.4 ? "Medium" : "Thin",
        intensity,
      };
    })
  );
}

export default function LiquidityHeatmap({ onSignal }) {
  const [timeframe, setTimeframe] = useState("15m");
  const [data, setData] = useState(generateHeatmap());
  const [hover, setHover] = useState(null);

  // 🔁 Auto refresh (visual simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateHeatmap());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔗 Emit AI signal safely
  useEffect(() => {
    if (onSignal) {
      onSignal(deriveHeatmapSignal(data));
    }
  }, [data, onSignal]);

  return (
    <div className="relative max-w-3xl rounded-xl bg-white/5 p-4 backdrop-blur animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Liquidity Heatmap</h3>

        {/* LEGEND — FIXED INSIDE CARD */}
        <div className="flex items-center gap-1 text-xs opacity-80">
          <span>Low</span>
          {[0.3, 0.5, 0.7, 0.9, 1].map((o, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: `rgba(168,85,247,${o})` }}
            />
          ))}
          <span>High</span>
        </div>
      </div>

      {/* TIMEFRAME SWITCH */}
      <div className="flex gap-2 mb-4">
        {timeframes.map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 rounded-full text-xs transition ${
              timeframe === tf
                ? "bg-violet-600 text-white"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* HEATMAP GRID */}
      <div className="space-y-2">
        {data.map((row, r) => (
          <div key={r} className="flex gap-2">
            {row.map((cell, c) => {
              const whale = cell.intensity > 0.85;
              return (
                <div
                  key={c}
                  onMouseEnter={() => setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  className={`h-4 w-7 rounded-md transition-all
                    ${cell.intensity > 0.7 ? "heatmap-pulse" : ""}
                    ${
                      whale
                        ? "ring-2 ring-violet-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                        : ""
                    }`}
                  style={{
                    background: `rgba(168,85,247,${0.25 + cell.intensity})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* TOOLTIP */}
      {hover && (
        <div className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur p-3 rounded-lg text-xs space-y-1 shadow-xl">
          <div><b>Price:</b> ${hover.price}</div>
          <div><b>Side:</b> {hover.side}</div>
          <div><b>Liquidity:</b> {hover.liquidity}</div>
          <div><b>Strength:</b> {hover.strength}</div>
        </div>
      )}
    </div>
  );
}

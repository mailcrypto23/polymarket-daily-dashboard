import { useState } from "react";

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
          intensity > 0.7
            ? "Strong"
            : intensity > 0.4
            ? "Medium"
            : "Thin",
        intensity,
      };
    })
  );
}

export default function LiquidityHeatmap() {
  const [timeframe, setTimeframe] = useState("15m");
  const [data, setData] = useState(generateHeatmap());
  const [hover, setHover] = useState(null);

  const changeTimeframe = (tf) => {
    setTimeframe(tf);
    setData(generateHeatmap());
  };

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Liquidity Heatmap</h3>

        {/* LEGEND */}
        <div className="flex items-center gap-1 text-xs opacity-80">
          <span>Low</span>
          {[0.2, 0.4, 0.6, 0.8, 1].map((o, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: `rgba(168,85,247,${o})` }}
            />
          ))}
          <span>High</span>
        </div>
      </div>

      {/* TIME CONTROLS */}
      <div className="flex gap-2 mb-4">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => changeTimeframe(tf)}
            className={`px-3 py-1 rounded-full text-xs transition
              ${
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
        {data.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((cell, cIdx) => {
              const intensity = cell.intensity;
              const isWhale = intensity > 0.85;

              return (
                <div
                  key={cIdx}
                  onMouseEnter={() => setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  className={`h-5 w-8 rounded-md cursor-pointer transition-all
                    ${intensity > 0.7 ? "heatmap-pulse" : ""}
                    ${
                      isWhale
                        ? "ring-2 ring-violet-400 shadow-[0_0_12px_rgba(168,85,247,0.9)]"
                        : ""
                    }
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

      {/* HOVER TOOLTIP */}
      {hover && (
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur p-3 rounded-lg text-xs shadow-lg space-y-1">
          <div>
            <strong>Price:</strong> ${hover.price}
          </div>
          <div>
            <strong>Side:</strong> {hover.side}
          </div>
          <div>
            <strong>Liquidity:</strong> {hover.liquidity}
          </div>
          <div>
            <strong>Strength:</strong> {hover.strength}
          </div>
        </div>
      )}
    </div>
  );
}

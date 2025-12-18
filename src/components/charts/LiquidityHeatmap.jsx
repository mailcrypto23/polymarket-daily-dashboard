import { useState, useEffect, useMemo } from "react";

const timeframes = ["5m", "15m", "1h"];

/* ===============================
   MOCK HEATMAP GENERATOR
   =============================== */
function generateHeatmap(rows = 6, cols = 14) {
  return Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).map(() => {
      const intensity = Math.random();
      return {
        price: (3200 + Math.random() * 60).toFixed(2),
        side: Math.random() > 0.5 ? "YES" : "NO",
        liquidity: `$${(Math.random() * 2.5 + 0.2).toFixed(2)}M`,
        strength:
          intensity > 0.75
            ? "Strong"
            : intensity > 0.45
            ? "Medium"
            : "Thin",
        intensity,
      };
    })
  );
}

export default function LiquidityHeatmap() {
  const [timeframe, setTimeframe] = useState("15m");
  const [data, setData] = useState(() => generateHeatmap());
  const [hover, setHover] = useState(null);

  /* 🔁 AUTO-FLUCTUATION (LIVE FEEL) */
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateHeatmap());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* 🔄 TIMEFRAME CHANGE */
  const changeTimeframe = (tf) => {
    setTimeframe(tf);
    setData(generateHeatmap());
  };

  /* 📊 SUMMARY STATS (fills blank space) */
  const stats = useMemo(() => {
    let total = 0;
    let whales = 0;

    data.flat().forEach((c) => {
      total += parseFloat(c.liquidity.replace("$", ""));
      if (c.intensity > 0.85) whales++;
    });

    return {
      total: total.toFixed(1),
      whales,
    };
  }, [data]);

  return (
    <div className="relative bg-premiumCard p-4 rounded-lg overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">Liquidity Heatmap</h3>
          <p className="text-xs opacity-60">
            Orderbook liquidity · Auto-refreshing
          </p>
        </div>

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

      {/* ================= TIME CONTROLS ================= */}
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

      {/* ================= HEATMAP GRID ================= */}
      <div className="space-y-2">
        {data.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((cell, cIdx) => {
              const isWhale = cell.intensity > 0.85;

              return (
                <div
                  key={cIdx}
                  onMouseEnter={() => setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  className={`h-5 w-9 rounded-md cursor-pointer transition-all
                    ${cell.intensity > 0.7 ? "heatmap-pulse" : ""}
                    ${
                      isWhale
                        ? "ring-2 ring-violet-400 shadow-[0_0_14px_rgba(168,85,247,0.9)]"
                        : ""
                    }
                  `}
                  style={{
                    background: `rgba(168,85,247,${0.25 + cell.intensity})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* ================= FOOTER STATS (PREMIUM FILL) ================= */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="bg-white/5 rounded-md p-2">
          <div className="opacity-60">Total Visible Liquidity</div>
          <div className="font-semibold text-green-400">
            ${stats.total}M
          </div>
        </div>

        <div className="bg-white/5 rounded-md p-2">
          <div className="opacity-60">Whale Walls Detected</div>
          <div className="font-semibold text-violet-400">
            {stats.whales}
          </div>
        </div>
      </div>

      {/* ================= HOVER TOOLTIP ================= */}
      {hover && (
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur p-3 rounded-lg text-xs shadow-lg space-y-1 animate-fadeIn">
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
export function deriveHeatmapSignal(data) {
  let yes = 0;
  let no = 0;
  let whales = 0;

  data.flat().forEach((c) => {
    const value = c.intensity;
    c.side === "YES" ? (yes += value) : (no += value);
    if (value > 0.85) whales++;
  });

  const dominance =
    yes > no ? "YES" : no > yes ? "NO" : "Neutral";

  const confidence = Math.min(
    96,
    Math.round(Math.abs(yes - no) * 28 + whales * 3)
  );

  return {
    dominance,
    confidence,
    whales,
    yesStrength: yes.toFixed(2),
    noStrength: no.toFixed(2),
  };
}



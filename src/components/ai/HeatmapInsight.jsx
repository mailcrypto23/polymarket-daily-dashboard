export default function HeatmapInsight({ signal }) {
  if (!signal) return null;

  const {
    dominance,
    confidence,
    whales,
    yesStrength,
    noStrength,
  } = signal;

  return (
    <div className="bg-gradient-to-br from-violet-900/70 to-purple-800/60
                    rounded-xl p-4 text-sm text-white shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          🧠 AI Market Insight
        </h3>
        <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
          Demo
        </span>
      </div>

      <p className="text-xs opacity-70 mb-2">
        Liquidity-weighted orderflow analysis
      </p>

      <div className="space-y-1 mb-3">
        <div>
          • <strong>{dominance}</strong> liquidity dominates
          ({dominance === "YES" ? yesStrength : noStrength})
        </div>

        <div>
          • Whale walls detected:{" "}
          <strong>{whales}</strong>
        </div>

        <div>
          • Orderflow imbalance favors{" "}
          <strong>{dominance}</strong>
        </div>
      </div>

      {/* CONFIDENCE BAR */}
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Confidence Score</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2 bg-black/30 rounded">
          <div
            className="h-2 rounded bg-green-400 transition-all"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <p className="text-[10px] opacity-50 mt-2">
        Generated using liquidity dominance, whale detection & spread signals
      </p>
    </div>
  );
}

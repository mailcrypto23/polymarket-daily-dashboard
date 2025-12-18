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
    <div className="rounded-2xl p-5
      bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-fuchsia-900/40
      border border-white/10 backdrop-blur text-white">

      <div className="flex items-center gap-2 mb-3">
        <span>🧠</span>
        <h3 className="text-sm font-semibold">AI Market Insight</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full
          bg-emerald-500/20 text-emerald-300">
          Demo
        </span>
      </div>

      <div className="text-sm mb-2">
        Dominant side:{" "}
        <span className="text-emerald-400 font-semibold">
          {dominance}
        </span>
      </div>

      <ul className="space-y-1 text-xs opacity-80">
        <li>• YES strength: {yesStrength}</li>
        <li>• NO strength: {noStrength}</li>
        <li>• Whale walls detected: {whales}</li>
        <li>• Orderflow imbalance favors {dominance}</li>
      </ul>

      <div className="mt-4">
        <div className="flex justify-between text-[10px] mb-1">
          <span>Confidence Score</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="mt-2 text-[10px] opacity-50">
        Generated from live liquidity + whale signals
      </div>
    </div>
  );
}

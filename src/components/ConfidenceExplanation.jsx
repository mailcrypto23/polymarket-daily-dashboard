export default function ConfidenceExplanation({ signal }) {
  if (!signal || !signal.confidenceBreakdown) return null;

  const {
    momentum,
    trend,
    volatility,
    liquidity,
    timePenalty,
    finalConfidence,
  } = signal.confidenceBreakdown;

  return (
    <div className="mt-3 rounded-lg bg-black/40 p-3 border border-white/10">
      <div className="text-xs font-semibold text-white/80 mb-2">
        Confidence Breakdown
      </div>

      <ul className="text-[11px] text-white/60 space-y-1">
        <li>Momentum Alignment: +{momentum}%</li>
        <li>Trend Strength: +{trend}%</li>
        <li>Volatility Fit: +{volatility}%</li>
        <li>Liquidity Confirmation: +{liquidity}%</li>
        {timePenalty > 0 && (
          <li className="text-yellow-400">
            Late Entry Penalty: −{timePenalty}%
          </li>
        )}
      </ul>

      <div className="mt-2 text-xs font-bold text-white">
        Final Confidence: {finalConfidence}%
      </div>
    </div>
  );
}

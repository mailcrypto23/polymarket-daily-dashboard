// Polymarket-style confidence explanation logic

export function explainConfidence({ confidence, remainingMs, tfMs }) {
  const pct = remainingMs / tfMs;

  if (confidence >= 70 && pct > 0.6)
    return {
      label: "Strong Momentum",
      reason: "High confidence early in window",
      color: "text-green-400"
    };

  if (confidence >= 60 && pct > 0.35)
    return {
      label: "Moderate Edge",
      reason: "Usable signal in mid window",
      color: "text-yellow-400"
    };

  if (confidence >= 60)
    return {
      label: "Late Momentum",
      reason: "Edge exists but timing is late",
      color: "text-orange-400"
    };

  return {
    label: "Weak Signal",
    reason: "Low confidence or poor timing",
    color: "text-red-400"
  };
}

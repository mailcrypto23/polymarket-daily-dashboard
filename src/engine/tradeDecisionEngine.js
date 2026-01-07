export function evaluateTrade(signal) {
  const {
    confidence,
    spreadPct,
    liquidityUSD,
    timeRemainingSec,
    volatility,
    trendAligned = true
  } = signal;

  let score = 0;
  const reasons = [];

  // Confidence
  if (confidence >= 70) score += 20;
  else if (confidence >= 62) score += 12;
  else reasons.push("Low confidence");

  // Liquidity
  if (liquidityUSD >= 100000) score += 20;
  else if (liquidityUSD >= 50000) score += 12;
  else reasons.push("Low liquidity");

  // Spread
  if (spreadPct <= 2) score += 20;
  else if (spreadPct <= 4) score += 10;
  else reasons.push("Wide spread");

  // Timing
  if (timeRemainingSec > 180) score += 15;
  else if (timeRemainingSec > 60) score += 8;
  else reasons.push("Too late to enter");

  // Trend
  if (trendAligned) score += 10;
  else reasons.push("Trend misaligned");

  // Volatility
  if (volatility === "high") {
    score -= 30;
    reasons.push("High volatility");
  }

  const verdict =
    score >= 70 && reasons.length < 3 ? "TRADE" : "SKIP";

  return {
    tradeScore: Math.max(0, Math.min(score, 100)),
    verdict,
    reasons
  };
}

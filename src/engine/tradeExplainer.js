/* =========================================================
   Trade Explainer Engine
   - Generates human-readable rationale
   - Uses edge, odds, regime, confidence, timing
========================================================= */

export function generateTradeExplanation(signal) {
  if (!signal) return null;

  const lines = [];

  // Direction & confidence
  lines.push(
    `Model bias favors ${signal.direction} with ${(signal.confidence * 100).toFixed(1)}% confidence.`
  );

  // Market odds comparison
  if (typeof signal.marketProbability === "number") {
    const marketPct = (signal.marketProbability * 100).toFixed(1);
    const edgePct = (signal.edge * 100).toFixed(1);

    if (signal.edge > 0) {
      lines.push(
        `Market implies ${marketPct}% probability, creating a +${edgePct}% edge.`
      );
    } else {
      lines.push(
        `Market odds (${marketPct}%) offer no positive edge vs model.`
      );
    }
  } else {
    lines.push(`Market odds not yet available for comparison.`);
  }

  // Regime filter
  if (signal.regime === "CHOP") {
    lines.push(
      `⚠ Market volatility is compressed; signal quality is reduced.`
    );
  } else if (signal.regime === "TREND") {
    lines.push(
      `Price action confirms directional momentum (trend regime).`
    );
  }

  // Entry timing
  if (!signal.entryOpen) {
    lines.push(
      `Entry window has closed; late entries historically underperform.`
    );
  } else {
    lines.push(
      `Entry window is open with sufficient time-to-resolution.`
    );
  }

  // Final recommendation
  if (signal.mispriced && signal.entryOpen && signal.regime !== "CHOP") {
    lines.push(`✅ Trade qualifies as positive expected value.`);
  } else {
    lines.push(`⚠ Trade does not meet strict EV criteria.`);
  }

  return lines;
}

/* =========================================================
   Market Regime Filter
   - Blocks signals in low-volatility chop
========================================================= */

export function isTradeableRegime(prices) {
  if (!prices || prices.length < 20) return true;

  const returns = prices.slice(1).map((p, i) =>
    Math.abs((p - prices[i]) / prices[i])
  );

  const avgVol =
    returns.reduce((a, b) => a + b, 0) / returns.length;

  // Below ~0.12% avg move → chop
  return avgVol > 0.0012;
}

/* =========================================================
   Kelly Sizing Engine (FINAL)
   - Fractional Kelly
   - Edge-aware
   - Capital-safe
========================================================= */

export function kellySize({
  edge,
  odds,
  maxFraction = 0.25,
}) {
  if (!edge || edge <= 0 || !odds || odds <= 1) return 0;

  const b = odds - 1;
  const p = edge + 1 / odds;
  const q = 1 - p;

  const kelly = (b * p - q) / b;

  if (!Number.isFinite(kelly) || kelly <= 0) return 0;

  return Number(
    Math.min(kelly, maxFraction).toFixed(4)
  );
}

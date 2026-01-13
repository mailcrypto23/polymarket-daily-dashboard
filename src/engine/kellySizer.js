export function kellySize({ prob, odds, maxFraction = 0.25 }) {
  if (prob <= 0 || prob >= 1 || odds <= 1) return 0;

  const b = odds - 1;
  const q = 1 - prob;

  const k = (b * prob - q) / b;

  if (k <= 0) return 0;

  return Number(Math.min(k, maxFraction).toFixed(4));
}

/* =========================================================
   Edge Calculator (Model vs Market)
========================================================= */

export function calculateEdge({ confidence, marketProb }) {
  if (
    typeof confidence !== "number" ||
    typeof marketProb !== "number"
  ) {
    return null;
  }

  const edge = confidence - marketProb;

  return {
    edge,
    edgePct: Math.round(edge * 1000) / 10, // %
    isPositive: edge > 0,
    strength:
      edge >= 0.05 ? "STRONG"
      : edge >= 0.02 ? "WEAK"
      : "NONE",
  };
}

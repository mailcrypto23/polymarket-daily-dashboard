/* =========================================================
   Fee-Adjusted Edge (FINAL)
========================================================= */

// Conservative estimate for Polymarket taker fees
const TAKER_FEE = 0.03; // 3%

export function getFeeAdjustedEdge(edge) {
  if (typeof edge !== "number") return null;

  return Number((edge - TAKER_FEE).toFixed(4));
}

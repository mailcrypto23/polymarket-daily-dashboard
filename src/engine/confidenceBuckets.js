/* =========================================================
   Confidence Bucket Analytics (FINAL)
========================================================= */

import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const BUCKETS = [
  [0.6, 0.65],
  [0.65, 0.7],
  [0.7, 0.75],
  [0.75, 0.8],
  [0.8, 0.85],
];

const MIN_SAMPLE = 10;

export function getConfidenceBuckets() {
  const resolved = getLastResolvedSignals(500);

  return BUCKETS.map(([min, max]) => {
    const group = resolved.filter(
      s => s.confidence >= min && s.confidence < max
    );

    const pnl = group.reduce((a, s) => a + (s.pnl || 0), 0);
    const wins = group.filter(s => s.result === "WIN").length;

    return {
      range: `${Math.round(min * 100)}–${Math.round(max * 100)}%`,
      count: group.length,
      winRate:
        group.length >= MIN_SAMPLE
          ? wins / group.length
          : null,
      pnl: Number(pnl.toFixed(4)),
    };
  });
}

/* =========================================================
   Entry Timing vs PnL Analytics (FINAL)
========================================================= */

import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const BUCKETS = [
  { label: "0–1m", min: 0, max: 1 },
  { label: "1–3m", min: 1, max: 3 },
  { label: "3–5m", min: 3, max: 5 },
  { label: "5–7m", min: 5, max: 7 },
  { label: "7m+", min: 7, max: Infinity },
];

const MIN_SAMPLE = 10;

export function getEntryTimingPnLStats(limit = 200) {
  const resolved = getLastResolvedSignals(limit).filter(
    s =>
      typeof s.entryDelayMs === "number" &&
      typeof s.pnl === "number"
  );

  return BUCKETS.map(bucket => {
    const signals = resolved.filter(s => {
      const mins = s.entryDelayMs / 60000;
      return mins >= bucket.min && mins < bucket.max;
    });

    const pnlSum = signals.reduce((acc, s) => acc + s.pnl, 0);

    return {
      label: bucket.label,
      count: signals.length,
      avgPnL:
        signals.length >= MIN_SAMPLE
          ? Number((pnlSum / signals.length).toFixed(4))
          : null,
    };
  });
}

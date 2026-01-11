import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

/**
 * Buckets entry delay (minutes) vs average PnL
 */
const BUCKETS = [
  { label: "0–1m", min: 0, max: 1 },
  { label: "1–3m", min: 1, max: 3 },
  { label: "3–5m", min: 3, max: 5 },
  { label: "5–7m", min: 5, max: 7 },
  { label: "7m+", min: 7, max: Infinity },
];

export function getEntryTimingPnLStats(limit = 100) {
  const resolved = getLastResolvedSignals(limit).filter(
    s =>
      s.entryDelayMs != null &&
      typeof s.confidence === "number"
  );

  return BUCKETS.map(bucket => {
    const signals = resolved.filter(s => {
      const mins = s.entryDelayMs / 60000;
      return mins >= bucket.min && mins < bucket.max;
    });

    const pnlSum = signals.reduce((acc, s) => {
      const pnl = s.result === "WIN" ? 1 : -1;
      return acc + pnl;
    }, 0);

    return {
      label: bucket.label,
      count: signals.length,
      avgPnL:
        signals.length > 0
          ? +(pnlSum / signals.length).toFixed(2)
          : null,
    };
  });
}

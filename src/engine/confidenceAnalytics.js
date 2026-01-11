import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const BUCKETS = [
  { label: "60–69%", min: 0.6, max: 0.699 },
  { label: "70–74%", min: 0.7, max: 0.749 },
  { label: "75–79%", min: 0.75, max: 0.799 },
  { label: "80%+", min: 0.8, max: 1.0 },
];

export function getConfidenceWinRateStats(limit = 50) {
  const resolved = getLastResolvedSignals(limit);

  const stats = BUCKETS.map(bucket => {
    const signals = resolved.filter(
      s =>
        s.confidence >= bucket.min &&
        s.confidence <= bucket.max
    );

    const wins = signals.filter(s => s.result === "WIN").length;

    return {
      label: bucket.label,
      total: signals.length,
      wins,
      winRate:
        signals.length > 0
          ? Math.round((wins / signals.length) * 100)
          : null,
    };
  });

  return stats;
}

/* =========================================================
   Confidence Calibration Loop (FINAL)
   - Learns bias between predicted confidence vs actual win-rate
========================================================= */

import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const MIN_SAMPLE = 30;
const MAX_ADJUST = 0.15;

export function calibrateConfidence(rawConfidence) {
  const resolved = getLastResolvedSignals(200);

  if (resolved.length < MIN_SAMPLE) return rawConfidence;

  const avgPred =
    resolved.reduce((a, s) => a + s.confidence, 0) / resolved.length;

  const winRate =
    resolved.filter(s => s.result === "WIN").length / resolved.length;

  const bias = winRate - avgPred;

  const correction = Math.max(
    -MAX_ADJUST,
    Math.min(MAX_ADJUST, bias)
  );

  return Number(
    Math.max(0.01, Math.min(0.99, rawConfidence + correction)).toFixed(4)
  );
}

/* =========================================================
   Drawdown Guard (FINAL)
   - Daily + Weekly loss limits
   - Hard stop on new entries
========================================================= */

import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const DAY_LIMIT = -0.05;   // -5%
const WEEK_LIMIT = -0.12; // -12%

function pnlSince(ts) {
  return getLastResolvedSignals(500)
    .filter(s => s.resolved && s.resolveAt >= ts)
    .reduce((a, s) => a + (s.pnl || 0), 0);
}

export function getDrawdownState() {
  const now = Date.now();

  const dayStart = new Date().setHours(0, 0, 0, 0);
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;

  const dayPnL = pnlSince(dayStart);
  const weekPnL = pnlSince(weekStart);

  return {
    dayPnL,
    weekPnL,
    blocked:
      dayPnL <= DAY_LIMIT ||
      weekPnL <= WEEK_LIMIT,
  };
}

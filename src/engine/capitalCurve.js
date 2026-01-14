/* =========================================================
   Capital Curve Simulation (FINAL)
========================================================= */

import { getLastResolvedSignals } from "./Crypto15mSignalEngine";

const START_CAPITAL = 100;

export function getCapitalCurve() {
  let capital = START_CAPITAL;

  return getLastResolvedSignals(500)
    .sort((a, b) => a.resolveAt - b.resolveAt)
    .map(s => {
      capital += s.pnl || 0;
      return {
        t: s.resolveAt,
        capital: Number(capital.toFixed(2)),
      };
    });
}

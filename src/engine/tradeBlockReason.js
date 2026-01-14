/* =========================================================
   Trade Block Reason Helper (FINAL)
========================================================= */

import { getDrawdownState } from "./drawdownGuard";

export function getTradeBlockReason(signal) {
  if (!signal.entryOpen) return "Entry window closed";

  const drawdown = getDrawdownState();
  if (drawdown.blocked) return "Drawdown limit reached";

  if (signal.regimeOK === false) return "Low-volatility regime";

  if (!signal.mispriced) return "No positive edge";

  return null;
}

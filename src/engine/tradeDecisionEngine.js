/* =========================================================
   Trade Decision Engine (FINAL)
   - Read-only
   - Deterministic
   - UI-safe
========================================================= */

export function getTradeDecision(signal, drawdownState) {
  if (!signal) {
    return { status: "BLOCKED", reason: "NO_SIGNAL" };
  }

  if (drawdownState?.blocked) {
    return { status: "BLOCKED", reason: "DRAWDOWN" };
  }

  if (signal.regimeOK === false) {
    return { status: "BLOCKED", reason: "REGIME" };
  }

  if (!signal.mispriced) {
    return { status: "BLOCKED", reason: "NO_EDGE" };
  }

  if (!signal.entryOpen) {
    return { status: "BLOCKED", reason: "ENTRY_CLOSED" };
  }

  return { status: "ALLOWED", reason: "OK" };
}

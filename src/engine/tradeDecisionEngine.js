const STORAGE_KEY = "pm_signals";

export function autoEnterSignals() {
  const now = Date.now();
  const signals = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  let changed = false;

  for (const s of signals) {
    if (
      s.outcome === "pending" &&
      !s.userDecision &&
      s.confidence >= 75 &&              // 🔒 CONFIDENCE RULE
      now < s.resolveAt - 3 * 60 * 1000   // SAFE WINDOW
    ) {
      s.userDecision = "ENTER";
      s.enteredAt = now;
      s.entryPrice = s.entryPrice ?? s.priceAtSignal;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  }
}

const STORAGE_KEY = "pm_signals";

export function resolveSignals(getPrice) {
  const now = Date.now();
  const signals = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  let changed = false;

  for (const s of signals) {
    if (
      s.outcome === "pending" &&
      s.userDecision === "ENTER" &&
      now >= s.resolveAt
    ) {
      const exitPrice = getPrice(s.asset);
      s.exitPrice = exitPrice;

      s.outcome =
        s.bias === "UP"
          ? exitPrice > s.entryPrice
            ? "WIN"
            : "LOSS"
          : exitPrice < s.entryPrice
          ? "WIN"
          : "LOSS";

      s.resolvedAt = now;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  }
}

// SAFE v1 – analytics only
// Computes live PnL summary from local signal log

const STORAGE_KEY = "pm_signal_history";

export function getPnLSummary(minConfidence = 0) {
  let signals = [];

  try {
    signals = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return emptySummary();
  }

  const filtered = signals.filter(
    s => s.confidence >= minConfidence && s.outcome
  );

  const total = filtered.length;
  const wins = filtered.filter(s => s.outcome === "win").length;
  const losses = filtered.filter(s => s.outcome === "loss").length;

  const winRate = total > 0 ? (wins / total) * 100 : 0;

  return {
    total,
    wins,
    losses,
    winRate: Number(winRate.toFixed(1))
  };
}

function emptySummary() {
  return {
    total: 0,
    wins: 0,
    losses: 0,
    winRate: 0
  };
}

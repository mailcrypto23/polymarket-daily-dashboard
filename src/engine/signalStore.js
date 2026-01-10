// Central in-memory + localStorage signal store
// SAFE: analytics + UI only (no execution)

// Storage key
const STORAGE_KEY = "pm_signal_history_v1";

// Load signals
export function getSignalHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Save full list
function saveSignalHistory(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

// Add or update a signal
export function upsertSignal(signal) {
  const history = getSignalHistory();

  const idx = history.findIndex(
    (s) => s.id === signal.id
  );

  if (idx >= 0) {
    history[idx] = { ...history[idx], ...signal };
  } else {
    history.unshift(signal);
  }

  // Keep only last 50 for safety
  saveSignalHistory(history.slice(0, 50));
}

// Get last resolved signals
export function getLastResolvedSignals(limit = 4) {
  return getSignalHistory()
    .filter((s) => s.outcome === "WIN" || s.outcome === "LOSS")
    .slice(0, limit);
}

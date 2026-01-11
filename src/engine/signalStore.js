// src/engine/signalStore.js
// Central signal lifecycle store for UI + analytics

const STORAGE_KEY = "pm_signal_history_v1";

/* =========================
   CORE STORAGE
========================= */

export function getSignalHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSignalHistory(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

/* =========================
   WRITE / UPDATE
========================= */

export function upsertSignal(signal) {
  const history = getSignalHistory();
  const index = history.findIndex(s => s.id === signal.id);

  if (index >= 0) {
    history[index] = { ...history[index], ...signal };
  } else {
    history.unshift(signal);
  }

  saveSignalHistory(history.slice(0, 100));
}

/**
 * Update a signal by id (used by resolver)
 */
export function updateSignal(id, updates) {
  const history = getSignalHistory();
  const index = history.findIndex(s => s.id === id);
  if (index === -1) return;

  history[index] = {
    ...history[index],
    ...updates,
  };

  saveSignalHistory(history);
}

/* =========================
   READ HELPERS
========================= */

/**
 * Active (unresolved) signals
 * REQUIRED by signalAutoResolver
 */
export function getActiveSignals() {
  return getSignalHistory().filter(s => !s.resolvedAt);
}

/**
 * Canonical resolved signals accessor (WIN / LOSS only)
 */
export function getResolvedSignals(limit = 4) {
  return getSignalHistory()
    .filter(s => s.outcome === "WIN" || s.outcome === "LOSS")
    .slice(0, limit);
}

/**
 * Backward-compatible alias (safe)
 */
export const getLastResolvedSignals = getResolvedSignals;

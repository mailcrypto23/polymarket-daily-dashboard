/* =========================================================
   SIGNAL PERSISTENCE (LOCAL STORAGE)
   Used for analytics + reload survival
========================================================= */

const STORAGE_KEY = "pm_resolved_signals_v1";
const MAX_SIGNALS = 500;

/* ---------------------------------------------------------
   Load persisted resolved signals
--------------------------------------------------------- */
export function loadResolvedSignals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------
   Persist a resolved signal (deduped)
--------------------------------------------------------- */
export function persistResolvedSignal(signal) {
  if (!signal || !signal.id || !signal.resolved) return;

  const existing = loadResolvedSignals();

  // prevent duplicates
  if (existing.find(s => s.id === signal.id)) return;

  const updated = [signal, ...existing].slice(0, MAX_SIGNALS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // fail silently (quota / private mode)
  }
}

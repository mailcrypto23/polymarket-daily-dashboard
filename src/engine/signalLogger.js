/* ================================
   SIGNAL LOGGER – SAFE v2 (FINAL)
   ================================ */

const STORAGE_KEY = "pm_signal_history_v2";

/* Load stored signals */
function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/* Persist signals */
function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

/* --------------------------------
   LOG NEW SIGNAL (ENTRY)
-------------------------------- */
export function logSignal({
  id,
  asset,
  direction,          // UP / DOWN
  confidence,         // 0–1
  entryPrice,
  source = "crypto-15m",
  createdAt = Date.now(),
  resolveAt
}) {
  const signals = loadSignals();

  const signal = {
    id: id ?? crypto.randomUUID(),
    asset,
    direction,
    confidence,
    entryPrice,
    exitPrice: null,
    source,
    createdAt,
    resolveAt,
    resolvedAt: null,
    outcome: "PENDING", // PENDING | WIN | LOSS
  };

  signals.unshift(signal);
  saveSignals(signals.slice(0, 200));

  return signal;
}

/* --------------------------------
   RESOLVE SIGNAL (AUTO)
-------------------------------- */
export function logResolvedSignal({
  id,
  exitPrice,
  outcome,
  resolvedAt = Date.now()
}) {
  const signals = loadSignals();
  const index = signals.findIndex(s => s.id === id);

  if (index === -1) return;

  signals[index] = {
    ...signals[index],
    exitPrice,
    outcome,       // WIN | LOSS
    resolvedAt
  };

  saveSignals(signals);
}

/* --------------------------------
   READ HELPERS (UI / ANALYTICS)
-------------------------------- */

/* Last N resolved signals */
export function getResolvedSignals(limit = 4) {
  return loadSignals()
    .filter(s => s.outcome === "WIN" || s.outcome === "LOSS")
    .slice(0, limit);
}

/* All signals (debug / export) */
export function getAllSignals() {
  return loadSignals();
}

/* --------------------------------
   EXPORT CSV
-------------------------------- */
export function exportSignalCSV() {
  const signals = loadSignals();
  if (!signals.length) {
    alert("No signal data available");
    return;
  }

  const headers = [
    "createdAt",
    "asset",
    "direction",
    "confidence",
    "entryPrice",
    "exitPrice",
    "outcome",
    "resolvedAt"
  ];

  const rows = signals.map(s =>
    headers.map(h => s[h] ?? "").join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "crypto_15m_signal_history.csv";
  a.click();

  URL.revokeObjectURL(url);
}

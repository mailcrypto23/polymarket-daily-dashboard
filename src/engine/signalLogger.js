/* ================================
   SIGNAL LOGGER – CANONICAL v3
   ================================ */

const STORAGE_KEY = "pm_signal_history_v2";

/* -------------------------------
   LOAD / SAVE
-------------------------------- */
function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

/* -------------------------------
   LOG ENTRY (NEW SIGNAL)
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
    outcome: "PENDING" // PENDING | WIN | LOSS
  };

  signals.unshift(signal);
  saveSignals(signals.slice(0, 200));

  return signal;
}

/* -------------------------------
   🔑 THIS WAS MISSING / BROKEN
   RESOLVE SIGNAL (AUTO ENGINE)
-------------------------------- */
export function logResolvedSignal({
  id,
  exitPrice,
  outcome,            // WIN | LOSS
  resolvedAt = Date.now()
}) {
  const signals = loadSignals();
  const index = signals.findIndex(s => s.id === id);

  if (index === -1) return;

  signals[index] = {
    ...signals[index],
    exitPrice,
    outcome,
    resolvedAt
  };

  saveSignals(signals);
}

/* -------------------------------
   READ HELPERS (UI)
-------------------------------- */
export function getResolvedSignals(limit = 4) {
  return loadSignals()
    .filter(s => s.outcome === "WIN" || s.outcome === "LOSS")
    .slice(0, limit);
}

export function getAllSignals() {
  return loadSignals();
}

/* -------------------------------
   CSV EXPORT
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

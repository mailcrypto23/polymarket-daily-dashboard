/* ================================
   SIGNAL LOGGER – SAFE v1
   ================================ */

const STORAGE_KEY = "pm_signal_history";

/* Load existing signals */
function loadSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/* Save signals */
function saveSignals(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
}

/* Log a NEW signal */
export function logSignal({
  market,
  side,
  confidence,
  source = "crypto-15m",
  price
}) {
  const signals = loadSignals();

  const signal = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    market,
    side,               // YES or NO
    confidence,         // 0–100
    price,
    source,
    outcome: "pending", // pending | win | loss
    resolvedAt: null,
    pnl: 0
  };

  signals.push(signal);
  saveSignals(signals);

  return signal;
}

/* Resolve signal after 15 minutes */
export function resolveSignal(id, finalPrice) {
  const signals = loadSignals();
  const signal = signals.find(s => s.id === id);
  if (!signal || signal.outcome !== "pending") return;

  const win =
    (signal.side === "YES" && finalPrice > signal.price) ||
    (signal.side === "NO" && finalPrice < signal.price);

  signal.outcome = win ? "win" : "loss";
  signal.resolvedAt = Date.now();
  signal.pnl = win ? 1 : -1; // $1 simulation

  saveSignals(signals);
}

/* Export CSV (DOWNLOAD BUTTON / CONSOLE USE) */
export function exportSignalCSV() {
  const signals = loadSignals();
  if (!signals.length) return alert("No signal data");

  const headers = [
    "timestamp",
    "market",
    "side",
    "confidence",
    "price",
    "outcome",
    "pnl"
  ];

  const rows = signals.map(s =>
    headers.map(h => s[h] ?? "").join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pm_signal_history.csv";
  a.click();

  URL.revokeObjectURL(url);
}

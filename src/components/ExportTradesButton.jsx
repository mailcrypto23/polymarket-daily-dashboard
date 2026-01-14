import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

export default function ExportTradesButton() {
  function exportCSV() {
    const rows = getLastResolvedSignals(500);

    const csv = [
      ["Time", "Symbol", "Confidence", "EntryDelay(min)", "Result", "PnL"],
      ...rows.map(s => [
        new Date(s.resolveAt).toISOString(),
        s.symbol,
        (s.confidence * 100).toFixed(1),
        s.entryDelayMs ? (s.entryDelayMs / 60000).toFixed(2) : "",
        s.result,
        s.pnl ?? 0,
      ]),
    ]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "trade_journal.csv";
    a.click();
  }

  return (
    <button
      onClick={exportCSV}
      className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-xs text-white"
    >
      Export Trade Journal
    </button>
  );
}

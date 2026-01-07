import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";

export default function TractionPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const pollSignals = () => {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setSignals(data);
      } catch {
        setSignals([]);
      }
    };

    // initial read
    pollSignals();

    // keep UI reactive
    const interval = setInterval(pollSignals, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = signals.length;
  const resolved = signals.filter(
    s => s.outcome && s.outcome !== "pending"
  );
  const wins = resolved.filter(s => s.outcome === "win");

  const winRate =
    resolved.length > 0
      ? ((wins.length / resolved.length) * 100).toFixed(1)
      : null;

  const exportCSV = () => {
    if (!signals.length) return;

    const header = ["Time", "Market", "Side", "Confidence", "Outcome"];
    const rows = signals.map(s => [
      new Date(s.createdAt).toISOString(),
      s.market,
      s.side,
      s.confidence,
      s.outcome ?? "pending"
    ]);

    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "crypto-15m-signals.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-white/5">
          <div className="text-sm text-white/60">Total Signals</div>
          <div className="text-xl font-bold">{total}</div>
        </div>

        <div className="p-4 rounded-lg bg-white/5">
          <div className="text-sm text-white/60">Resolved</div>
          <div className="text-xl font-bold">{resolved.length}</div>
        </div>

        <div className="p-4 rounded-lg bg-white/5">
          <div className="text-sm text-white/60">Win Rate</div>
          <div className="text-xl font-bold">
            {winRate ? `${winRate}%` : "—"}
          </div>
        </div>
      </div>

      <button
        onClick={exportCSV}
        className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm"
      >
        Export CSV
      </button>
    </>
  );
}

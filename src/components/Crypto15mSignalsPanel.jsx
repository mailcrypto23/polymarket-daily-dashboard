import { useEffect, useState } from "react";

const STORAGE_KEY = "pm_signal_history";
const RESOLVE_MS = 15 * 60 * 1000;

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Manual trade decision layer
 * (human-readable, no auto execution)
 */
function evaluateDecision(signal) {
  let score = 0;
  const reasons = [];

  // Confidence
  if (signal.confidence >= 65) score += 20;
  else reasons.push("Low confidence");

  // Trend alignment (based on provided history: strong downtrend)
  if (signal.side === "NO") score += 20;
  else reasons.push("Against trend");

  // Volatility (XRP higher, others low)
  if (signal.symbol === "XRP") {
    score += 10;
  } else {
    score += 15;
  }

  // Liquidity proxy (Polymarket maker rebates → acceptable)
  score += 15;

  // Timing
  const remaining = (signal.resolveAt || 0) - Date.now();
  if (remaining > 5 * 60 * 1000) score += 15;
  else reasons.push("Late entry");

  const verdict = score >= 70 ? "TRADE" : "SKIP";

  return { score, verdict, reasons };
}

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const poll = () => {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSignals(data);
    };
    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const sorted = [...signals].sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  const topFive = sorted.slice(0, 5);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Market</th>
            <th className="p-3 text-center">Side</th>
            <th className="p-3 text-center">Conf</th>
            <th className="p-3 text-center">Countdown</th>
            <th className="p-3 text-center">Decision</th>
          </tr>
        </thead>

        <tbody>
          {topFive.map((s, i) => {
            const remaining = (s.resolveAt || s.createdAt + RESOLVE_MS) - Date.now();
            const decision = evaluateDecision(s);

            return (
              <tr key={i} className="border-t border-white/10">
                <td className="p-3">{formatTime(s.createdAt)}</td>
                <td className="p-3">{s.market}</td>
                <td className="p-3 text-center">{s.side}</td>
                <td className="p-3 text-center">{s.confidence}%</td>
                <td className="p-3 text-center">
                  {formatCountdown(remaining)}
                </td>
                <td
                  className={`p-3 text-center font-semibold ${
                    decision.verdict === "TRADE"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {decision.verdict}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

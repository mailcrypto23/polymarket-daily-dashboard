import { useEffect, useState } from "react";
import SignalCard from "./SignalCard";

const STORAGE_KEY = "pm_signals"; // ✅ unified key

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const poll = () => {
      try {
        const raw = JSON.parse(
          window.localStorage.getItem(STORAGE_KEY) || "[]"
        );

        const active = raw.filter(
          s =>
            s &&
            typeof s.createdAt === "number" &&
            typeof s.resolveAt === "number" &&
            s.outcome === "pending"
        );

        setSignals(
          active.sort((a, b) => b.createdAt - a.createdAt)
        );
      } catch {
        setSignals([]);
      }
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const handleDecision = (id, decision) => {
    const raw = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "[]"
    );

    const idx = raw.findIndex(s => s.id === id);
    if (idx === -1) return;

    raw[idx].userDecision = decision;
    raw[idx].enteredAt = Date.now(); // ✅ lock entry

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(raw)
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/60">
        Trade signals individually · Enter only during SAFE window
      </div>

      {signals.length === 0 && (
        <div className="text-white/40 text-sm">
          Waiting for next 15m signal…
        </div>
      )}

      {signals.map(signal => (
        <SignalCard
          key={signal.id}
          signal={signal}
          onDecision={handleDecision}
        />
      ))}
    </div>
  );
}

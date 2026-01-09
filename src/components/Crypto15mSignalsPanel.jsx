import { useEffect, useRef, useState } from "react";
import SignalCard from "./SignalCard";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signals, setSignals] = useState([]);
  const decided = useRef(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const poll = () => {
      let raw = [];
      try {
        raw = JSON.parse(
          window.localStorage.getItem(STORAGE_KEY) || "[]"
        );
      } catch {
        raw = [];
      }

      const active = raw.filter(
        s =>
          s &&
          typeof s.createdAt === "number" &&
          typeof s.resolveAt === "number" &&
          s.outcome === "pending"
      );

      setSignals(
        active.sort((a, b) => b.createdAt - a.createdAt).slice(0, 4)
      );
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const handleDecision = (id, decision) => {
    if (typeof window === "undefined") return;

    let raw = [];
    try {
      raw = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch {
      raw = [];
    }

    const idx = raw.findIndex(s => s.id === id);
    if (idx !== -1) raw[idx].userDecision = decision;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(raw)
    );

    setSignals(s => s.filter(sig => sig.id !== id));
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

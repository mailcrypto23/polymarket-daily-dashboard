// src/components/Crypto15mSignalsPanel.jsx
import { useEffect, useState } from "react";
import Crypto15mSignalCard from "./Crypto15mSignalCard";

const STORAGE_KEY = "pm_signal_history";

export default function Crypto15mSignalsPanel() {
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const poll = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const active = raw.find(s => s.outcome === "pending");
        setSignal(active || null);
      } catch {
        setSignal(null);
      }
    };

    poll();
    const i = setInterval(poll, 1000);
    return () => clearInterval(i);
  }, []);

  const handleDecision = (id, decision) => {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = raw.findIndex(s => s.id === id);
    if (idx !== -1) raw[idx].userDecision = decision;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  };

  return (
    <div className="space-y-4">
      {!signal && (
        <div className="text-white/40 text-sm">
          Waiting for next 15m signal…
        </div>
      )}

      {signal && (
        <Crypto15mSignalCard
          signal={signal}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}

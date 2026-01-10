// src/components/SafeWindowTimer.jsx
import { useEffect, useState } from "react";

export default function SafeWindowTimer({ createdAt, safeUntil, resolveAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  if (!createdAt || !resolveAt) return null;

  const remaining = Math.max(0, Math.floor((resolveAt - now) / 1000));
  const safeRemaining = Math.max(0, Math.floor((safeUntil - now) / 1000));

  const isSafe = now <= safeUntil;

  return (
    <div className="flex justify-between items-center text-xs mt-2">
      <span className={isSafe ? "text-green-400" : "text-red-400"}>
        {isSafe ? "SAFE ENTRY WINDOW" : "ENTRY LOCKED"}
      </span>
      <span className="text-white/60">
        Resolve in {remaining}s
      </span>
    </div>
  );
}

import { useEffect, useState } from "react";

export function useCountdown(targetTime) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((targetTime - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    remaining,
    label: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    isExpired: remaining <= 0,
    isUrgent: remaining <= 180, // 🔴 under 3 min
  };
}

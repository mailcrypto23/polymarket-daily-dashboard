import { useEffect, useState } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  // Persist claim state
  useEffect(() => {
    const stored = localStorage.getItem("lastWinningBetClaimed");
    if (stored === "true") {
      setClaimed(true);
    }
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    localStorage.setItem("lastWinningBetClaimed", "true");
  };

  if (claimed) return null; // auto-hide after claim

  return (
    <div
      className="
        relative mx-2 mt-4 rounded-xl p-4 text-white
        bg-gradient-to-r from-emerald-600/80 via-green-600/80 to-teal-600/80
        animate-pulseGlow
      "
    >
      {/* Ticket cut effect */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

      <div className="text-[10px] uppercase tracking-wide opacity-80">
        Last Winning Bet
      </div>

      <div className="mt-1 font-semibold text-sm">
        FOMC Result — Rate Hold
      </div>

      <div className="text-[12px] opacity-90 mb-2">
        YES · Stake $2,500
      </div>

      <div className="text-2xl font-bold text-white mb-3">
        +10,000&nbsp;USDC
      </div>

      <button
        onClick={handleClaim}
        className="
          w-full py-2 rounded-full text-sm font-semibold
          bg-white/20 hover:bg-white/30 transition
        "
      >
        Claim
      </button>
    </div>
  );
}

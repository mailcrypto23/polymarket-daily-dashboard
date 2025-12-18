import { useEffect, useState } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lastWinningClaimed");
    if (saved === "true") setClaimed(true);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    localStorage.setItem("lastWinningClaimed", "true");
  };

  const resetDemo = () => {
    localStorage.removeItem("lastWinningClaimed");
    setClaimed(false);
  };

  return (
    <div
      className="relative mx-2 mt-4 rounded-xl p-4 text-white
                 bg-gradient-to-r from-emerald-600/80 via-green-600/80 to-teal-600/80
                 animate-pulseGlow"
    >
      {/* ticket cuts */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

      <div className="text-[10px] uppercase opacity-80 mb-1">
        Last Winning Bet
      </div>

      <div className="text-sm font-semibold">
        FOMC Result — Rate Hold
      </div>

      <div className="text-[11px] opacity-80 mb-2">
        YES · Stake $2,500
      </div>

      <div className="text-xl font-bold mb-3 text-white">
        +10,000 USDC
      </div>

      {!claimed ? (
        <button
          onClick={handleClaim}
          className="w-full rounded-full bg-black/30 py-1.5 text-sm font-medium hover:bg-black/40"
        >
          Claim
        </button>
      ) : (
        <>
          <div className="text-center text-sm text-white/80 mb-2">
            ✅ Claimed
          </div>

          {/* DEMO ONLY */}
          <button
            onClick={resetDemo}
            className="w-full rounded-full bg-white/10 py-1 text-[11px] text-white/70 hover:bg-white/20"
          >
            Reset Demo
          </button>
        </>
      )}
    </div>
  );
}

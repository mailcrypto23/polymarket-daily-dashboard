import { useState } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  if (claimed) return null; // disappears after claim

  return (
    <div className="relative mx-2 mt-4 rounded-xl p-4 text-white
                    bg-gradient-to-r from-emerald-600/80 via-green-600/80 to-teal-600/80">
      
      {/* Ticket cuts */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

      <div className="text-[10px] uppercase tracking-wide opacity-80">
        🎉 Winning Bet (Unclaimed)
      </div>

      <div className="text-sm font-semibold mt-1">
        FOMC Rate Decision
      </div>

      <div className="text-xs opacity-90 mb-2">
        YES · Stake $6,000
      </div>

      <div className="text-2xl font-bold text-green-200 mb-3">
        +10,000 USDC
      </div>

      <button
        onClick={() => {
          alert("✅ 10,000 USDC Claimed");
          setClaimed(true);
        }}
        className="w-full py-2 rounded-full text-sm font-semibold
                   bg-white/20 hover:bg-white/30 transition"
      >
        Claim Reward
      </button>
    </div>
  );
}

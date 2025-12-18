import { useState, useEffect } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  // persist claim
  useEffect(() => {
    const saved = localStorage.getItem("lastWinningClaimed");
    if (saved === "true") setClaimed(true);
  }, []);

  const claim = () => {
    setClaimed(true);
    localStorage.setItem("lastWinningClaimed", "true");
  };

  if (claimed) {
  return (
    <div className="mx-2 mt-4 rounded-xl p-4 bg-emerald-900/40 text-emerald-300">
      ✅ Last winning bet claimed
    </div>
  );
}


  return (
    <div
      className="
        relative mx-2 mt-4 rounded-xl p-4 text-white
        bg-gradient-to-r from-emerald-600/80 via-green-600/80 to-teal-600/80
        animate-pulseGlow
      "
    >
      {/* ticket cuts */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

      <div className="text-[10px] uppercase tracking-wide opacity-80">
        Last Winning Bet
      </div>

      <div className="font-semibold mt-1">
        FOMC Result — Rate Hold
      </div>

      <div className="text-sm opacity-90 mb-2">
        YES · Stake $2,500
      </div>

      <div className="text-2xl font-bold text-white">
        +10,000 USDC
      </div>

      <button
        onClick={claim}
        className="mt-3 w-full py-2 rounded-full text-sm font-semibold
                   bg-black/20 hover:bg-black/30 transition"
      >
        Claim
      </button>
    </div>
  );
}

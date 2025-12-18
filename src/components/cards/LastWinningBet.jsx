import { useState } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="relative mx-2 mt-4 rounded-xl p-4 text-white
                    bg-gradient-to-r from-emerald-600/80 via-green-600/80 to-teal-600/80">
      <div className="text-[10px] uppercase opacity-80">
        Last Winning Bet
      </div>

      <div className="font-semibold mt-1">
        FOMC Result — Rate Hold
      </div>

      <div className="text-sm opacity-90">
        YES · Stake $2,500
      </div>

      <div className="text-2xl font-bold text-white mt-2">
        +10,000 USDC
      </div>

      <button
        disabled={claimed}
        onClick={() => {
          alert("✅ 10,000 USDC Claimed");
          setClaimed(true);
        }}
        className="mt-3 w-full py-2 rounded-full text-sm font-semibold
                   bg-white/20 hover:bg-white/30
                   disabled:opacity-40"
      >
        {claimed ? "Claimed" : "Claim"}
      </button>
    </div>
  );
}

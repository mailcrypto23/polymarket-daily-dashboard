import { useState } from "react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700
                    rounded-xl p-4 text-white">
      <div className="text-xs opacity-80">Last Winning Bet</div>
      <div className="font-semibold">ETH ETF Approval</div>
      <div className="text-sm opacity-90 mb-2">
        YES · Stake $600
      </div>

      <div className="text-2xl font-bold text-green-300">
        +1000 USDC
      </div>

      <button
        disabled={claimed}
        onClick={() => {
          alert("✅ 1000 USDC Claimed");
          setClaimed(true);
        }}
        className="mt-3 w-full py-2 rounded-full text-sm font-semibold
                   bg-white/20 hover:bg-white/30 transition
                   disabled:opacity-40"
      >
        {claimed ? "Claimed" : "Claim"}
      </button>
    </div>
  );
}

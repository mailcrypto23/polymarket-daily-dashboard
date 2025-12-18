import { useEffect, useState } from "react";
import ClaimModal from "../ui/ClaimModal";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // restore claim state
  useEffect(() => {
    const saved = localStorage.getItem("fomc_claimed");
    if (saved === "true") setClaimed(true);
  }, []);

  const handleClaim = async () => {
    // MetaMask simulation
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    await new Promise((r) => setTimeout(r, 1200)); // fake tx delay

    localStorage.setItem("fomc_claimed", "true");
    setClaimed(true);
    setShowModal(true);
  };

  if (claimed) return null;

  return (
    <>
      <div className="relative rounded-xl p-4 text-white
                      bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600
                      animate-pulseGlow">
        <div className="text-[10px] uppercase opacity-80">
          Last Winning Bet
        </div>

        <div className="font-semibold">
          FOMC Result — Rate Hold
        </div>

        <div className="text-sm opacity-90 mb-2">
          YES · Stake $2,500
        </div>

        <div className="text-2xl font-bold text-white mb-3">
          +10,000 USDC
        </div>

        <button
          onClick={handleClaim}
          className="w-full py-2 rounded-full bg-black/20 hover:bg-black/30 transition"
        >
          Claim with MetaMask
        </button>
      </div>

      <ClaimModal
        open={showModal}
        amount="10,000"
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

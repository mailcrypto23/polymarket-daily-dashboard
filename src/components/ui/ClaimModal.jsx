import React from "react";

export default function ClaimModal({ open, onClose, amount }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-premiumCard rounded-xl p-6 w-[340px] text-center">
        <h3 className="text-lg font-semibold mb-2">
          🎉 Claim Successful
        </h3>

        <p className="text-sm opacity-80 mb-4">
          You have claimed
        </p>

        <div className="text-2xl font-bold text-green-400 mb-4">
          +{amount} USDC
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

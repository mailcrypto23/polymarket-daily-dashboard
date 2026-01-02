import React, { useEffect } from "react";

/* Core sections */
// if file is liquidityHeatmap.jsx
import LiquidityHeatmap from "../components/liquidityHeatmap";
import MarketDepth from "../components/MarketDepth";
import PriceMovement from "../components/PriceMovement";
import AIMarketInsight from "../components/AIMarketInsight";
import SpreadScanner from "../components/SpreadScanner";
import TractionPanel from "../components/TractionPanel";

/* Engines */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  // Run 15m crypto signal engine on load + every minute
  useEffect(() => {
    runCrypto15mEngine();

    const interval = setInterval(() => {
      runCrypto15mEngine();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* ===================== */}
      {/* PRICE + DEPTH */}
      {/* ===================== */}
      <div className="grid grid-cols-2 gap-6">
        <PriceMovement />
        <MarketDepth />
      </div>

      {/* ===================== */}
      {/* HEATMAP + TRACTION */}
      {/* (THIS WAS THE BLANK GAP) */}
      {/* ===================== */}
      <div className="grid grid-cols-2 gap-6">
        <LiquidityHeatmap />
        <TractionPanel />
      </div>

      {/* ===================== */}
      {/* AI + SPREAD */}
      {/* ===================== */}
      <div className="grid grid-cols-2 gap-6">
        <AIMarketInsight />
        <SpreadScanner />
      </div>
    </div>
  );
}


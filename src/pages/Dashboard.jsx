import React, { useEffect } from "react";

/* Core components */
import LiquidityHeatmap from "../components/LiquidityHeatmap";
import TractionPanel from "../components/TractionPanel";

/* Charts */
import MarketDepth from "../components/charts/MarketDepth";
import PriceMovement from "../components/charts/PriceMovement";
import SpreadScanner from "../components/charts/SpreadScanner";

/* AI */
import AIMarketInsight from "../components/ai/AIMarketInsight";

/* Engine */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  // Run crypto signal engine on load + periodic refresh
  useEffect(() => {
    runCrypto15mEngine();

    const interval = setInterval(() => {
      runCrypto15mEngine();
    }, 60 * 1000); // refresh signals every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* PRICE + DEPTH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceMovement />
        <MarketDepth />
      </div>

      {/* HEATMAP + TRACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiquidityHeatmap />
        <TractionPanel />
      </div>

      {/* AI + SPREAD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIMarketInsight />
        <SpreadScanner />
      </div>
    </div>
  );
}

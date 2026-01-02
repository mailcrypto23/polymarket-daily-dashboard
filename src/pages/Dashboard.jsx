import React, { useEffect } from "react";

/* Existing components (REAL FILES) */
import CandlesChart from "../components/CandlesChart";
import Orderbook from "../components/Orderbook";
import Heatmap from "../components/Heatmap";
import AIMarketInsight from "../components/AIMarketInsight";
import SpreadScanner from "../components/SpreadScanner";
import TractionPanel from "../components/TractionPanel";

/* Engines */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();

    const interval = setInterval(runCrypto15mEngine, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">

      {/* PRICE + DEPTH */}
      <div className="grid grid-cols-2 gap-6">
        <CandlesChart />
        <Orderbook />
      </div>

      {/* HEATMAP + TRACTION */}
      <div className="grid grid-cols-2 gap-6">
        <Heatmap />
        <TractionPanel />
      </div>

      {/* AI + SPREAD */}
      <div className="grid grid-cols-2 gap-6">
        <AIMarketInsight />
        <SpreadScanner />
      </div>

    </div>
  );
}

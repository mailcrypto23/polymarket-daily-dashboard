import React, { useEffect } from "react";

/* ✅ VERIFIED existing components */
import CandlesChart from "../components/CandlesChart";
import Orderbook from "../components/Orderbook";
import Heatmap from "../components/Heatmap";
import SpreadScanner from "../components/SpreadScanner";
import TractionPanel from "../components/TractionPanel";
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";

/* Engine */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const id = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">

      {/* Price */}
      <CandlesChart />

      {/* Orderbook */}
      <Orderbook />

      {/* Liquidity */}
      <Heatmap />

      {/* 15m Crypto Signals */}
      <Crypto15mSignalsPanel />

      {/* Spread Scanner */}
      <SpreadScanner />

      {/* Traction / Win Rate */}
      <TractionPanel />

    </div>
  );
}

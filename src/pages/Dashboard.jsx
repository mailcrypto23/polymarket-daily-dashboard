import React, { useEffect } from "react";

/* VERIFIED COMPONENTS ONLY */
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import Heatmap from "../components/Heatmap";
import Orderbook from "../components/Orderbook";

/* Engine */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const id = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-10">

      {/* Orderbook + Liquidity */}
      <div className="space-y-4">
        <Orderbook />
        <Heatmap />
      </div>

      {/* Crypto Signals (CORE VALUE) */}
      <Crypto15mSignalsPanel />

      {/* Performance / Traction */}
      <TractionPanel />

    </div>
  );
}

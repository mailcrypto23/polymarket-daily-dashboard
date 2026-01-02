import React, { useEffect } from "react";

/* ✅ Exact real paths */
import CandlesChart from "../components/CandlesChart";
import Orderbook from "../components/Orderbook";
import Heatmap from "../components/Heatmap";
import TractionPanel from "../components/TractionPanel";
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";

/* ⬇️ NOTE: SpreadScanner is inside /charts */
import SpreadScanner from "../components/charts/SpreadScanner";

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

      <CandlesChart />

      <Orderbook />

      <Heatmap />

      <Crypto15mSignalsPanel />

      <SpreadScanner />

      <TractionPanel />

    </div>
  );
}

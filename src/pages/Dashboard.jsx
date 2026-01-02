import { useEffect } from "react";

import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import Orderbook from "../components/Orderbook";
import Heatmap from "../components/Heatmap";

import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const i = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">

      <Crypto15mSignalsPanel />

      <TractionPanel />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PriceMovement />
        <MarketDepthPanel />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Heatmap />
        <Orderbook />
      </section>

    </div>
  );
}

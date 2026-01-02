import { useEffect } from "react";

import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import Orderbook from "../components/Orderbook";

import LiquidityHeatmap from "../charts/LiquidityHeatmap";

import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const i = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">

      {/* SIGNALS */}
      <section>
        <Crypto15mSignalsPanel />
      </section>

      {/* PERFORMANCE */}
      <section>
        <TractionPanel />
      </section>

      {/* PRICE + DEPTH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Price Movement</h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Market Depth</h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* HEATMAP + ORDERBOOK */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <LiquidityHeatmap />
        </div>

        <div>
          <Orderbook />
        </div>
      </section>

    </div>
  );
}

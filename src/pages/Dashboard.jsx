import { useEffect } from "react";

import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import TopOpportunities from "../components/TopOpportunities";

import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    // 🔹 Force first run so signals appear immediately
    runCrypto15mEngine({ force: true });

    // 🔹 Normal engine tick (safe)
    const interval = setInterval(() => {
      runCrypto15mEngine();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">

      {/* CRYPTO SIGNALS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Crypto 15-Minute Signals</h2>
        <Crypto15mSignalsPanel />
      </section>

      {/* TRACTION */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* MARKET VISUALS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Price Movement</h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Market Depth</h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* LIQUIDITY HEATMAP */}
      <section>
        <LiquidityHeatmap />
      </section>

      {/* HIGH CONFIDENCE */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🔥 High-Confidence Opportunities
        </h2>
        <TopOpportunities />
      </section>

    </div>
  );
}

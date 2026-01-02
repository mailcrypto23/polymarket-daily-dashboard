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
    runCrypto15mEngine();
    const interval = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">

      {/* CRYPTO SIGNALS */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Crypto 15-Minute Signals
        </h2>
        <Crypto15mSignalsPanel />
      </section>

      {/* TRACTION */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* MARKET VISUALS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-3">
            Price Movement
          </h3>
          <PriceMovement />
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-3">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* LIQUIDITY HEATMAP (FIXED BOXED LAYOUT) */}
      <section className="bg-white/5 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          Liquidity Heatmap
        </h3>
        <LiquidityHeatmap />
      </section>

      {/* HIGH-CONFIDENCE — ONLY ONCE */}
      <section>
        <TopOpportunities />
      </section>

    </div>
  );
}

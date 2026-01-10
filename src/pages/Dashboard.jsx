import { useEffect } from "react";

import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    // Run engine once on mount (safe, no auto-trading)
    runCrypto15mEngine();

    const interval = setInterval(() => {
      runCrypto15mEngine();
    }, 60_000); // check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">

      {/* 🔥 MULTI-ASSET 15m SIGNAL GRID */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h2>
        <Crypto15mSignalGrid />
      </section>

      {/* 📊 TRACTION & PERFORMANCE */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* 📈 PRICE + DEPTH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Price Movement
          </h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* 🌊 LIQUIDITY */}
      <section>
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

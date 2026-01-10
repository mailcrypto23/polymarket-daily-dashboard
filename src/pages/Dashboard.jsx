import { useEffect, useMemo } from "react";

import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

import { runCrypto15mSignalEngine } from "../engine/Crypto15mSignalEngine";

/**
 * Dashboard
 * Polymarket-style manual signal UI
 */
export default function Dashboard() {
  useEffect(() => {
    // Run engine once on mount
    runCrypto15mSignalEngine();

    // Keep engine alive safely
    const interval = setInterval(() => {
      runCrypto15mSignalEngine();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {/* =======================
          ACTIVE SIGNAL
      ======================= */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Crypto 15-Minute Signal
        </h2>

        {/* 
          This component is already responsible for:
          - showing ONE signal
          - SAFE window
          - ENTER / SKIP
          - timer
          - confidence
        */}
        <Crypto15mSignalsPanel />
      </section>

      {/* =======================
          PERFORMANCE
      ======================= */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* =======================
          MARKET DATA
      ======================= */}
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

      {/* =======================
          LIQUIDITY
      ======================= */}
      <section>
        <LiquidityHeatmap />
      </section>
    </div>
  );
}

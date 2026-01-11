import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
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

      {/* 📊 CONFIDENCE vs WIN-RATE */}
      <section>
        <ConfidenceWinRateChart />
      </section>

      {/* ⏱ ENTRY TIMING vs PnL (EDGE DECAY PROOF) */}
      <section>
        <EntryTimingPnLChart />
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

import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10">

      {/* 🔥 PRIMARY — SIGNALS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h2>
        <Crypto15mSignalGrid />
      </section>

      {/* 📊 TRACTION (COMPACT SUMMARY) */}
      <section>
        <TractionPanel />
      </section>

      {/* 🧠 EDGE PROOF — ANALYTICS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceWinRateChart />
        <EntryTimingPnLChart />
      </section>

      {/* 📈 MARKET CONTEXT */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Price Movement
          </h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* 🌊 LIQUIDITY (SUPPORTING SIGNAL) */}
      <section>
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

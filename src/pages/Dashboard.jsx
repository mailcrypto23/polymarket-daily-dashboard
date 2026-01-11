import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
  return (
    <div className="space-y-10 max-w-[1400px] mx-auto px-4">

      {/* 🔥 PRIMARY HEADER (ONCE ONLY) */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
      </section>

      {/* 🔥 SIGNAL GRID */}
      <section>
        <Crypto15mSignalGrid />
      </section>

      {/* 📊 TRACTION SUMMARY */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <TractionPanel />
      </section>

      {/* 📊 ANALYTICS GRID */}
      <section className="grid grid-cols-12 gap-6">

        {/* Confidence vs Win Rate */}
        <div className="col-span-12 lg:col-span-6 bg-black/40 border border-white/10 rounded-xl p-4">
          <ConfidenceWinRateChart />
        </div>

        {/* Entry Timing vs PnL */}
        <div className="col-span-12 lg:col-span-6 bg-black/40 border border-white/10 rounded-xl p-4">
          <EntryTimingPnLChart />
        </div>

      </section>

      {/* 📈 MARKET MICROSTRUCTURE */}
      <section className="grid grid-cols-12 gap-6">

        {/* Price Movement */}
        <div className="col-span-12 lg:col-span-7 bg-black/40 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            Price Movement
            <span className="text-xs text-white/40">Low → High</span>
          </h3>
          <PriceMovement />
        </div>

        {/* Market Depth */}
        <div className="col-span-12 lg:col-span-5 bg-black/40 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>

      </section>

      {/* 🌊 LIQUIDITY HEATMAP */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

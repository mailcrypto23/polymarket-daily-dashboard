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

      {/* 🔥 SINGLE MAIN TITLE (REMOVED DUPLICATE) */}
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <Crypto15mSignalGrid />
      </section>

      {/* 📊 TRACTION */}
      <section>
        <TractionPanel />
      </section>

      {/* 📈 ANALYTICS — COMPACT GRID */}
      <section className="grid grid-cols-12 gap-4">

        {/* Confidence vs Win Rate */}
        <div className="col-span-12 lg:col-span-4 bg-black/40 border border-white/10 rounded-xl p-4">
          <ConfidenceWinRateChart />
        </div>

        {/* Entry Timing vs PnL */}
        <div className="col-span-12 lg:col-span-4 bg-black/40 border border-white/10 rounded-xl p-4">
          <EntryTimingPnLChart />
        </div>

        {/* Price Movement */}
        <div className="col-span-12 lg:col-span-4 bg-black/40 border border-white/10 rounded-xl p-4">
          <PriceMovement />
        </div>

        {/* Liquidity Heatmap (WIDE) */}
        <div className="col-span-12 lg:col-span-8 bg-black/40 border border-white/10 rounded-xl p-4">
          <LiquidityHeatmap />
        </div>

        {/* Market Depth (TALL + NARROW) */}
        <div className="col-span-12 lg:col-span-4 bg-black/40 border border-white/10 rounded-xl p-4">
          <MarketDepthPanel />
        </div>

      </section>

    </div>
  );
}

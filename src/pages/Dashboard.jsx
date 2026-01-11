import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">

      {/* 🔥 MAIN PAGE TITLE (ONLY ONCE) */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
      </section>

      {/* SIGNAL GRID */}
      <section>
        <Crypto15mSignalGrid />
      </section>

      {/* TRACTION */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <TractionPanel />
      </section>

      {/* ANALYTICS ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <ConfidenceWinRateChart />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <EntryTimingPnLChart />
        </div>
      </section>

      {/* PRICE + DEPTH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <PriceMovement />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <MarketDepthPanel />
        </div>
      </section>

      {/* LIQUIDITY */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

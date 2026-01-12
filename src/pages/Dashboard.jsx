import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-premium min-h-screen">

      {/* TITLE */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-white/90">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <div className="text-xs text-white/40">
          Last updated · {lastUpdated}
        </div>
      </div>

      {/* 🔒 STICKY SIGNAL STRIP */}
      <section className="sticky top-0 z-30 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="px-4 py-4">
          <Crypto15mSignalGrid />
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 space-y-8 pt-6">

        <section className="card-soft p-4">
          <TractionPanel variant="compact" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-soft p-4">
            <ConfidenceWinRateChart />
          </div>
          <div className="card-soft p-4">
            <EntryTimingPnLChart />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-soft p-4">
            <PriceMovement />
          </div>
          <div className="card-soft p-4">
            <MarketDepthPanel />
          </div>
        </section>

        <section className="card-soft p-4">
          <LiquidityHeatmap />
        </section>

      </div>
    </div>
  );
}

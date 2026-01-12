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
      <section className="px-6 pt-6 pb-3">
        <h1 className="text-lg font-semibold">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <div className="text-xs text-white/40">
          Last updated · {lastUpdated}
        </div>
      </section>

      {/* 🔥 STICKY SIGNAL STRIP */}
      <section className="sticky top-0 z-30 bg-black/80 backdrop-blur px-6 py-3">
        <Crypto15mSignalGrid />
      </section>

      {/* CONTENT */}
      <section className="px-6 space-y-6 mt-4">

        <TractionPanel variant="compact" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConfidenceWinRateChart />
          <EntryTimingPnLChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PriceMovement />
          <MarketDepthPanel />
        </div>

        <LiquidityHeatmap />

      </section>
    </div>
  );
}

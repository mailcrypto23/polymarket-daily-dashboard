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
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* 🔥 TITLE */}
        <header className="pt-6">
          <h1 className="text-xl font-semibold tracking-tight text-white/90">
            🔥 High-Confidence Crypto 15-Minute Signals
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Last updated · {lastUpdated}
          </p>
        </header>

        {/* ➡️ STICKY SIGNAL STRIP */}
        <section className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-black/70 backdrop-blur border-b border-white/10">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            <Crypto15mSignalGrid />
          </div>
        </section>

        {/* 📊 TRACTION — COMPACT KPI STRIP */}
        <section className="card-soft p-4">
          <TractionPanel variant="compact" />
        </section>

        {/* 📈 ANALYTICS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-soft p-4">
            <ConfidenceWinRateChart />
          </div>
          <div className="card-soft p-4">
            <EntryTimingPnLChart />
          </div>
        </section>

        {/* 📉 PRICE + DEPTH */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card-soft p-4">
            <PriceMovement />
          </div>
          <div className="card-soft p-4">
            <MarketDepthPanel />
          </div>
        </section>

        {/* 🌊 LIQUIDITY */}
        <section className="card-soft p-4 mb-8">
          <LiquidityHeatmap />
        </section>

      </div>
    </div>
  );
}

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
    <div className="space-y-6 w-full px-6">

      {/* 🔥 HEADER */}
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <span className="text-xs text-white/40">
          Last updated · {lastUpdated}
        </span>
      </section>

      {/* 🚀 STICKY FULL-WIDTH SIGNAL STRIP */}
      <section className="sticky top-0 z-30 bg-black/70 backdrop-blur-md py-3 -mx-6 px-6 border-b border-white/10">
        <Crypto15mSignalGrid />
      </section>

      {/* 📊 KPI STRIP */}
      <TractionPanel variant="compact" />

      {/* 📈 ANALYTICS */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ConfidenceWinRateChart />
        <EntryTimingPnLChart />
      </section>

      {/* 📉 PRICE + DEPTH */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PriceMovement />
        <MarketDepthPanel />
      </section>

      {/* 🌊 LIQUIDITY */}
      <LiquidityHeatmap />

    </div>
  );
}

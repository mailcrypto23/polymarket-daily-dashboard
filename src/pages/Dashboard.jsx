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
    <div className="space-y-8 max-w-7xl mx-auto px-4">

      {/* 🔥 TITLE + META */}
      <section className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-white/90">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <div className="text-xs text-white/40">
          Last updated · {lastUpdated}
        </div>
      </section>

      {/* ➡️ HORIZONTAL SCROLLING SIGNALS */}
      <section className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          <Crypto15mSignalGrid />
        </div>
      </section>

      {/* 📊 TRACTION — SINGLE ROW KPI STRIP */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <TractionPanel variant="compact" />
      </section>

      {/* 📈 ANALYTICS — CONNECTED ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <ConfidenceWinRateChart />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <EntryTimingPnLChart />
        </div>
      </section>

      {/* 📉 PRICE + DEPTH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <PriceMovement />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <MarketDepthPanel />
        </div>
      </section>

      {/* 🌊 LIQUIDITY */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

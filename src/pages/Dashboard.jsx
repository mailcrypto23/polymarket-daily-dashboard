import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import DrawdownBanner from "../components/DrawdownBanner";
import CapitalCurveChart from "../components/CapitalCurveChart";

export default function Dashboard() {
  return (
    <div className="bg-premium min-h-screen w-full px-6 space-y-8">

      {/* 🔥 TITLE */}
      <header className="pt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
        <p className="text-xs text-white/40 mt-1">
          Last updated · live
        </p>
      </header>

      {/* 🚨 DRAWDOWN WARNING */}
      <DrawdownBanner />

      {/* 📌 STICKY SIGNAL STRIP */}
      <section className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="py-4">
          <Crypto15mSignalGrid />
        </div>
      </section>

      {/* 📊 TRACTION */}
      <section>
        <TractionPanel variant="compact" />
      </section>

      {/* 📈 ANALYTICS */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ConfidenceWinRateChart />
        <EntryTimingPnLChart />
      </section>

      {/* 💰 CAPITAL CURVE */}
      <section>
        <CapitalCurveChart />
      </section>

      {/* 📉 PRICE + 🌊 LIQUIDITY */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10">
        <PriceMovement />
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

export default function Dashboard() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 space-y-10">

      {/* ===============================
         HERO TITLE (ONLY ONCE)
      =============================== */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          🔥 High-Confidence Crypto 15-Minute Signals
        </h1>
      </section>

      {/* ===============================
         ZONE 1 — SIGNAL GRID
      =============================== */}
      <section>
        <Crypto15mSignalGrid />
      </section>

      {/* ===============================
         ZONE 2 — TRACTION
      =============================== */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <TractionPanel />
      </section>

      {/* ===============================
         ZONE 3 — EDGE PROOF (ANALYTICS)
      =============================== */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <ConfidenceWinRateChart />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <EntryTimingPnLChart />
        </div>

      </section>

      {/* ===============================
         ZONE 4 — MARKET CONTEXT
      =============================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">
            Price Movement
          </h3>
          <PriceMovement />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>

      </section>

      {/* ===============================
         ZONE 5 — LIQUIDITY
      =============================== */}
      <section className="bg-black/40 border border-white/10 rounded-xl p-4">
        <LiquidityHeatmap />
      </section>

    </div>
  );
}

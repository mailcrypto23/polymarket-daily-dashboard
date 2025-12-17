import React, { useState } from "react";

/* Layout */
import Sidebar from "../components/Sidebar";

/* Header UI */
import NeonPriceTicker from "../components/NeonPriceTicker";

/* Phase-1 Core Sections */
import QuickActions from "../components/QuickActions";
import SlidingStats from "../components/SlidingStats";
import TopOpportunities from "../components/TopOpportunities";


/* Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

export default function Dashboard() {
  /* Global active market (used by charts & ticker) */
  const [activeMarket, setActiveMarket] = useState("ETH");

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />

      <main className="flex-1 p-6 space-y-10">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Polymarket — Premium</h1>
            <p className="text-sm opacity-70">
              High-confidence markets · Live demo
            </p>
          </div>
          <NeonPriceTicker pair={`${activeMarket}/USDT`} />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <QuickActions />

        {/* ================= SLIDING STATS ================= */}
        <SlidingStats />

        {/* ================= TOP OPPORTUNITIES ================= */}
        <TopOpportunities />

        {/* ================= CHARTS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Price Movement</h3>
            <LinePriceChart market={activeMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Market Depth</h3>
            <MarketDepth market={activeMarket} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Liquidity Heatmap</h3>
            <LiquidityHeatmap market={activeMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Spread Scanner</h3>
            <SpreadScanner market={activeMarket} />
          </div>
        </section>
      </main>
    </div>
  );
}


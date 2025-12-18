import React, { useState } from "react";

/* Layout */
import Sidebar from "../components/Sidebar";

/* Data widgets */
import TopOpportunities from "../components/TopOpportunities";

/* Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

/* Controls */
import MarketSelector from "../components/orderflow/MarketSelector";

export default function Dashboard() {
  /* Active market selector */
  const [activeMarket, setActiveMarket] = useState("ETH");

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-semibold">
              Polymarket — Premium
            </h1>
            <p className="text-sm opacity-70">
              High-confidence markets · Live demo
            </p>
          </div>

          {/* Portfolio + Wallet */}
          <div className="text-right bg-premiumCard rounded-xl px-4 py-3">
            <div className="text-xs opacity-70 mb-1">Portfolio</div>
            <div className="text-2xl font-bold">$0.00</div>
            <div className="text-[11px] opacity-60 mt-1">
              MetaMask · Not connected
            </div>
          </div>
        </div>

        {/* ================= HIGH-CONFIDENCE OPPORTUNITIES ================= */}
        <TopOpportunities />

        {/* ================= MARKET SELECTOR ================= */}
        <MarketSelector
          value={activeMarket}
          onChange={setActiveMarket}
        />

        {/* ================= ANALYTICS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Price Movement</h3>
            <LinePriceChart market={activeMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Market Depth</h3>
            <MarketDepth market={activeMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Liquidity Heatmap</h3>
            <LiquidityHeatmap market={activeMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Spread Scanner</h3>
            <SpreadScanner market={activeMarket} />
          </div>
        </section>

        {/* ⛔ NOTHING AFTER THIS */}
      </main>
    </div>
  );
}


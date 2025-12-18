import React, { useState } from "react";

/* UI */
import NeonPriceTicker from "../components/NeonPriceTicker";

/* Data widgets */
import TopOpportunities from "../components/TopOpportunities";

/* AI */
import AIExplanationPanel from "../components/ai/AIExplanationPanel";

/* Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

/* Orderflow */
import MarketSelector from "../components/orderflow/MarketSelector";

export default function Dashboard() {
  const [activeMarket, setActiveMarket] = useState("ETH");

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Polymarket — Premium
          </h1>
          <p className="text-sm opacity-70">
            High-confidence markets · Live demo
          </p>
        </div>

        <NeonPriceTicker pair={`${activeMarket}/USDT`} />
      </div>

      {/* ================= HIGH-CONFIDENCE OPPORTUNITIES ================= */}
      <TopOpportunities />

      {/* ================= AI EXPLANATION PANEL ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" />
        <AIExplanationPanel />
      </section>

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

      {/* ⛔ END DASHBOARD CONTENT */}
    </div>
  );
}

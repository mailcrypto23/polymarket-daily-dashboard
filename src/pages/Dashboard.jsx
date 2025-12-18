import React, { useState } from "react";

/* UI */
import NeonPriceTicker from "../components/NeonPriceTicker";

/* Data widgets */
import TopOpportunities from "../components/TopOpportunities";

/* AI */
import HeatmapInsight from "../components/ai/HeatmapInsight";

/* Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

/* Orderflow */
import MarketSelector from "../components/orderflow/MarketSelector";

export default function Dashboard() {
  const [activeMarket, setActiveMarket] = useState("ETH");
  const [heatmapSignal, setHeatmapSignal] = useState(null);

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

      {/* ================= TOP OPPORTUNITIES ================= */}
      <TopOpportunities />

      {/* ================= MARKET SELECTOR ================= */}
      <MarketSelector
        value={activeMarket}
        onChange={setActiveMarket}
      />

      {/* ================= PRICE + DEPTH ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-premiumCard p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Price Movement</h3>
          <LinePriceChart market={activeMarket} />
        </div>

        <div className="bg-premiumCard p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Market Depth</h3>
          <MarketDepth market={activeMarket} />
        </div>
      </section>

      {/* ================= HEATMAP + AI INSIGHT ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Heatmap (wide) */}
        <div className="lg:col-span-2 bg-premiumCard p-4 rounded-lg">
          <LiquidityHeatmap
            market={activeMarket}
            onSignal={setHeatmapSignal}
          />
        </div>

        {/* AI Insight (compact & anchored) */}
        <HeatmapInsight signal={heatmapSignal} />
      </section>

      {/* ================= SPREAD SCANNER ================= */}
      <section className="grid grid-cols-1">
        <div className="bg-premiumCard p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Spread Scanner</h3>
          <SpreadScanner market={activeMarket} />
        </div>
      </section>

    </div>
  );
}

import React, { useEffect, useState } from "react";

/* Layout */
import Sidebar from "../components/Sidebar";

/* UI */
import NeonPriceTicker from "../components/NeonPriceTicker";
import LastTradeCard from "../components/cards/LastTradeCard";

/* Data widgets */
import TopOpportunities from "../components/TopOpportunities";
import MarketsTable from "../components/MarketsTable";
import OrderbookWidget from "../components/OrderbookWidget";

/* Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

/* Orderflow */
import MarketSelector from "../components/orderflow/MarketSelector";
import YesNoOrderbook from "../components/orderflow/YesNoOrderbook";

/* Mock Data */
import mockMarkets from "../mock-data/markets.json";

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeMarket, setActiveMarket] = useState("ETH");

  const lastTrade = {
    id: "TX-12885",
    pair: "ETH/USDT",
    side: "BUY",
    price: "3191.90",
    size: "0.42 ETH",
    time: Date.now(),
  };

  useEffect(() => {
    setMarkets(mockMarkets || []);
    setSelected(mockMarkets?.[0] || null);
  }, []);

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />

      <main className="flex-1 p-6 space-y-8">
        {/* HEADER */}
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

        <LastTradeCard trade={lastTrade} />

        <TopOpportunities />

        <MarketSelector
          active={activeMarket}
          onChange={setActiveMarket}
        />

        {/* CHARTS */}
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

        {/* YES / NO */}
        <section className="bg-premiumCard p-4 rounded-lg">
          <h3 className="font-semibold mb-3">YES / NO Liquidity</h3>
          <YesNoOrderbook market={selected} />
        </section>

        {/* MARKETS */}
        <section>
          <h2 className="text-xl font-medium mb-3">Markets</h2>
          <div className="bg-premiumCard p-4 rounded-lg">
            <MarketsTable markets={markets} onSelect={setSelected} />
          </div>
        </section>

        {/* ORDERBOOK + PORTFOLIO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Orderbook</h3>
            <OrderbookWidget market={selected} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Portfolio</h3>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-sm opacity-70 mt-2">
              Mock demo — API replaces this
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

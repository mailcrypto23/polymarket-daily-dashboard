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
    if (mockMarkets?.length) {
      setMarkets(mockMarkets);
      setSelected(mockMarkets[0]);
    }
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

        {/* LAST TRADE */}
        <LastTradeCard trade={lastTrade} />

        {/* TOP OPPORTUNITIES */}
        <TopOpportunities />

        {/* MARKET SELECTOR */}
        <MarketSelector
          active={activeMarket}
          onChange={setActiveMarket}
        />

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart title="Price Movement">
            <LinePriceChart market={activeMarket} />
          </Chart>

          <Chart title="Market Depth">
            <MarketDepth market={activeMarket} />
          </Chart>

          <Chart title="Liquidity Heatmap">
            <LiquidityHeatmap market={activeMarket} />
          </Chart>

          <Chart title="Spread Scanner">
            <SpreadScanner market={activeMarket} />
          </Chart>
        </section>

        {/* YES / NO ORDERFLOW */}
        <section className="bg-premiumCard p-4 rounded-lg">
          <h3 className="font-semibold mb-3">
            YES / NO Liquidity
          </h3>
          <YesNoOrderbook market={activeMarket} />
        </section>

        {/* MARKETS TABLE */}
        <section>
          <h2 className="text-xl font-medium mb-3">Markets</h2>
          <div className="bg-premiumCard p-4 rounded-lg">
            <MarketsTable
              markets={markets}
              onSelect={setSelected}
            />
          </div>
        </section>

        {/* ORDERBOOK + PORTFOLIO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart title="Orderbook">
            <OrderbookWidget market={selected} />
          </Chart>

          <Chart title="Portfolio">
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-sm opacity-70 mt-2">
              Mock demo — API replaces this
            </p>
          </Chart>
        </section>
      </main>
    </div>
  );
}

/* Small helper */
function Chart({ title, children }) {
  return (
    <div className="bg-premiumCard p-4 rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

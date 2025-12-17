import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import PremiumCard from "../components/PremiumCard";
import NeonPriceTicker from "../components/NeonPriceTicker";

import LastTradeCard from "../components/cards/LastTradeCard";

import MarketsTable from "../components/MarketsTable";
import OrderbookWidget from "../components/OrderbookWidget";

/* 📊 Charts */
import LinePriceChart from "../components/charts/LinePriceChart";
import MarketDepth from "../components/charts/MarketDepth";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import SpreadScanner from "../components/charts/SpreadScanner";

/* 🔁 Orderflow */
import MarketSelector from "../components/orderflow/MarketSelector";
import YesNoOrderbook from "../components/orderflow/YesNoOrderbook";

/* 🧪 Mock Data */
import mockMarkets from "../mock-data/markets.json";
import orderbook from "../mock-data/orderbook.json";

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("ETH");

  const [selected, setSelected] = useState(null);

  const [lastTrade] = useState({
    id: "TX-12885",
    pair: "ETH/USDT",
    side: "BUY",
    price: "3191.90",
    size: "0.42 ETH",
    time: Date.now(),
  });

  useEffect(() => {
    setMarkets(mockMarkets);
    setSelected(mockMarkets[0]);
  }, []);

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />

      <main className="flex-1 p-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Polymarket — Premium</h1>
            <p className="text-sm opacity-70">
              Hybrid dashboard · Mock live demo
            </p>
          </div>
          <NeonPriceTicker pair={`${selectedMarket}/USDT`} />
        </div>

        {/* METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PremiumCard title="Earnings" value="234" subtitle="Today" />
          <PremiumCard title="Expenses" value="0" subtitle="Today" />
          <PremiumCard title="Net" value="136" subtitle="Today" />
        </section>

        {/* LAST TRADE */}
        <LastTradeCard trade={lastTrade} />

        {/* 📈 CHARTS ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Price Chart</h3>
            <LinePriceChart market={selectedMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Market Depth</h3>
            <MarketDepth market={selectedMarket} />
          </div>
        </section>

        {/* 🔥 LIQUIDITY + SPREAD */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Liquidity Heatmap</h3>
            <LiquidityHeatmap market={selectedMarket} />
          </div>

          <div className="bg-premiumCard p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Spread Scanner</h3>
            <SpreadScanner />
          </div>
        </section>

        {/* 🟢 POLYMARKET STYLE YES / NO ORDERFLOW */}
        <section className="bg-premiumCard p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">YES / NO Liquidity</h3>
            <MarketSelector
              markets={Object.keys(orderbook)}
              selected={selectedMarket}
              onChange={setSelectedMarket}
            />
          </div>

          <YesNoOrderbook data={orderbook[selectedMarket]} />
        </section>

        {/* MARKETS TABLE */}
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

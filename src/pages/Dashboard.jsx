import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PremiumCard from "../components/PremiumCard";
import NeonPriceTicker from "../components/NeonPriceTicker";
import MarketsTable from "../components/MarketsTable";
import OrderbookWidget from "../components/OrderbookWidget";
import mockMarkets from "../mock-data/markets.json";

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setMarkets(mockMarkets);
    setSelected(mockMarkets[0]);
  }, []);

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Polymarket — Premium</h1>
            <p className="text-sm opacity-70">
              Hybrid dashboard · Mock live demo
            </p>
          </div>
          <NeonPriceTicker pair={selected?.pair || "ETH/USDT"} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PremiumCard title="Earnings" value="234" subtitle="Today" />
          <PremiumCard title="Expenses" value="0" subtitle="Today" />
          <PremiumCard title="Net" value="136" subtitle="Today" />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3">Markets</h2>
          <div className="bg-premiumCard p-4 rounded-lg">
            <MarketsTable markets={markets} onSelect={setSelected} />
          </div>
        </section>

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

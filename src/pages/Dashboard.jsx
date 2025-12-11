import React, { useEffect, useState } from "react";
import { fetchMarkets } from "../services/markets";
import { fetchPortfolio } from "../services/portfolio";
import { fetchOrderbook } from "../services/orderbook";

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const m = await fetchMarkets();
    const p = await fetchPortfolio();
    setMarkets(m);
    setPortfolio(p);
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard ⚡ Premium</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">Earnings Today<br/>234</div>
        <div className="bg-gray-800 p-4 rounded-xl">Expenses Today<br/>0</div>
        <div className="bg-gray-800 p-4 rounded-xl">Net Today<br/>136</div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Markets</h2>
      <div className="grid grid-cols-4 gap-4">
        {markets.map((m) => (
          <div key={m.symbol} className="bg-gray-800 p-4 rounded-xl">
            <div className="text-lg font-bold">{m.name}</div>
            <div className="text-gray-300">{m.symbol}</div>
            <div className="text-green-300">${m.price}</div>
            <div className="text-sm text-gray-400">{m.change24h}%</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-3">Portfolio</h2>
      {portfolio && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <div>Total Value: ${portfolio.totalValue}</div>
          <div>PNL Today: {portfolio.pnlToday}</div>
        </div>
      )}
    </div>
  );
}

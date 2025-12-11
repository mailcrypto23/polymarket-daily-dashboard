// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchMarkets } from "../services/markets";
import { fetchPortfolio } from "../services/portfolio";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    fetchMarkets().then(setMarkets);
    fetchPortfolio().then(setPortfolio);
  }, []);

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Polymarket — Premium</h1>
        <span className="opacity-75">acct: 0x…ABCD</span>
      </div>

      {/* STATS BLOCK */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1b2333] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg opacity-60">Earnings (Today)</h3>
            <TrendingUp className="text-green-400" />
          </div>
          <p className="text-4xl font-bold mt-3">234</p>
        </div>

        <div className="bg-[#1b2333] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg opacity-60">Expenses (Today)</h3>
            <TrendingDown className="text-red-400" />
          </div>
          <p className="text-4xl font-bold mt-3">0</p>
        </div>

        <div className="bg-[#1b2333] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg opacity-60">Net (Today)</h3>
            <Wallet className="text-purple-400" />
          </div>
          <p className="text-4xl font-bold mt-3">136</p>
        </div>
      </div>

      {/* MINI PORTFOLIO CARD */}
      {portfolio && (
        <div className="bg-[#111827] p-6 rounded-xl mb-10">
          <h2 className="text-2xl font-semibold mb-4">My Portfolio</h2>
          {portfolio.positions.length === 0 ? (
            <div className="opacity-60">No active positions</div>
          ) : (
            portfolio.positions.map((pos, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b border-white/10"
              >
                <div>{pos.market}</div>
                <div className="font-bold">{pos.pnl > 0 ? "+" : ""}{pos.pnl}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MARKET PREVIEW */}
      <h2 className="text-2xl font-bold mb-4">Markets (Sample)</h2>

      {markets.length === 0 ? (
        <div className="opacity-60">No market mock-data found.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {markets.slice(0, 8).map((m, i) => (
            <div
              key={i}
              className="bg-[#1b2333] p-5 rounded-xl hover:bg-[#222b3d] transition"
            >
              <h3 className="text-lg font-semibold">{m.name}</h3>

              <div className="text-sm opacity-60 mt-1">Vol: {m.volume}</div>

              <div className="h-20 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={m.sparkline}>
                    <Line type="monotone" dataKey="v" stroke="#7b5cff" strokeWidth={2} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-right">
                <span className="text-xl font-bold">{m.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

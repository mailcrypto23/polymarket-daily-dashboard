// src/pages/Market.jsx
import React, { useEffect, useState } from "react";
import { fetchMarkets } from "../services/markets";

export default function Market() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchMarkets().then(setData);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Market Overview</h1>

      <div className="bg-[#0f1624] rounded-xl p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="opacity-60 border-b border-white/10">
              <th className="py-2">Market</th>
              <th>Price</th>
              <th>24h Vol</th>
              <th>Trend</th>
            </tr>
          </thead>

          <tbody>
            {data.map((m, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-3">{m.name}</td>
                <td>${m.price}</td>
                <td>{m.volume}</td>
                <td>
                  <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
                    {m.change}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="opacity-60 mt-4">No mock markets available.</div>
        )}
      </div>
    </div>
  );
}

// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

import HighConfidenceOpportunities from "../components/HighConfidenceOpportunities";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";

const STORAGE_KEY = "pm_signal_history";

export default function Dashboard() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const poll = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const active = raw.filter(
          s => s && s.outcome === "pending"
        );
        setSignals(active);
      } catch {
        setSignals([]);
      }
    };

    poll();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">

      {/* 🔥 CRYPTO 15M SIGNALS */}
      <HighConfidenceOpportunities signals={signals} />

      {/* 📊 TRACTION */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* 📈 MARKET */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Price Movement
          </h3>
          <PriceMovement />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>
      </section>

      <LiquidityHeatmap />
    </div>
  );
}

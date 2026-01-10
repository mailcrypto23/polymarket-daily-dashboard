// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

import HighConfidenceOpportunities from "../components/HighConfidenceOpportunities";
import TractionStats from "../components/TractionStats";
import PriceMovement from "../components/PriceMovement";
import MarketDepth from "../components/MarketDepth";
import LiquidityHeatmap from "../components/LiquidityHeatmap";

const STORAGE_KEY = "pm_signal_history";

export default function Dashboard() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pollSignals = () => {
      try {
        const raw = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        // Only show ACTIVE or PENDING signals
        const active = raw.filter(
          s =>
            s &&
            s.outcome === "pending" &&
            typeof s.createdAt === "number"
        );

        setSignals(active);
      } catch {
        setSignals([]);
      }
    };

    pollSignals();
    const interval = setInterval(pollSignals, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">

      {/* 🔥 HIGH CONFIDENCE (CRYPTO SIGNALS LIVE HERE) */}
      <HighConfidenceOpportunities signals={signals} />

      {/* 📊 TRACTION */}
      <TractionStats />

      {/* 📈 PRICE + DEPTH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceMovement />
        <MarketDepth />
      </div>

      {/* 🌊 LIQUIDITY */}
      <LiquidityHeatmap />

    </div>
  );
}

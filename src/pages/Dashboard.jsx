import React, { useEffect } from "react";

/* VERIFIED components only */
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import PriceMovement from "../components/charts/CandlesChart";
import MarketDepth from "../components/OrderbookWidget";
import Heatmap from "../components/Heatmap";
import AIMarketInsight from "../components/ai/AIChat";
import SpreadScanner from "../components/charts/SpreadScanner";

/* Engine */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  // Run signal engine on load + every minute
  useEffect(() => {
    runCrypto15mEngine();
    const interval = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10">

      {/* ========================= */}
      {/* 1️⃣ CRYPTO 15-MIN SIGNALS */}
      {/* ========================= */}
      <Crypto15mSignalsPanel />

      {/* ================================= */}
      {/* 2️⃣ TRACTION / PERFORMANCE (SAME ORDER) */}
      {/* ================================= */}
      <TractionPanel />

      {/* ============================== */}
      {/* 3️⃣ PRICE + ORDERBOOK */}
      {/* ============================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceMovement />
        <MarketDepth />
      </div>

      {/* ============================== */}
      {/* 4️⃣ HEATMAP + AI INSIGHT */}
      {/* ============================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Heatmap />
        <AIMarketInsight />
      </div>

      {/* ============================== */}
      {/* 5️⃣ SPREAD SCANNER (LAST) */}
      {/* ============================== */}
      <SpreadScanner />

    </div>
  );
}

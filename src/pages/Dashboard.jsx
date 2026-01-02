import React, { useEffect } from "react";

/* ================================
   VERIFIED TOP-LEVEL COMPONENTS
   ================================ */
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";
import Heatmap from "../components/Heatmap";
import Orderbook from "../components/Orderbook";

/* SAFE WRAPPER COMPONENTS */
import PriceMovement from "../components/PriceMovement";
import MarketDepthPanel from "../components/MarketDepthPanel";

/* SIGNAL ENGINE */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const interval = setInterval(runCrypto15mEngine, 60_000); // every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 pb-24">

      {/* ===============================
         1️⃣ CRYPTO 15-MINUTE SIGNALS
         =============================== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Crypto 15-Minute Signals
        </h2>
        <Crypto15mSignalsPanel />
      </section>

      {/* ===============================
         2️⃣ TRACTION & PERFORMANCE
         =============================== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Traction & Signal Performance
        </h2>
        <TractionPanel />
      </section>

      {/* ===============================
         3️⃣ PRICE + DEPTH ANALYTICS
         =============================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Price Movement
          </h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Market Depth
          </h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* ===============================
         4️⃣ LIQUIDITY + ORDER FLOW
         =============================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Liquidity Heatmap
          </h3>
          <Heatmap />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Order Book
          </h3>
          <Orderbook />
        </div>
      </section>

    </div>
  );
}

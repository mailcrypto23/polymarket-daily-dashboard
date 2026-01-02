{/* REMOVE this line */}
{/* <h2 className="section-title">🔥 High-Confidence Opportunities</h2> */}

<TopOpportunities />
import { useEffect } from "react";

/* ===== CORE SIGNALS ===== */
import Crypto15mSignalsPanel from "../components/Crypto15mSignalsPanel";
import TractionPanel from "../components/TractionPanel";

/* ===== MARKET VISUALS (SAFE WRAPPERS ONLY) ===== */
import PriceMovement from "../components/PriceMovement";
import Heatmap from "../components/Heatmap";
import MarketDepthPanel from "../components/MarketDepthPanel";

/* ===== OPPORTUNITIES ===== */
import TopOpportunities from "../components/TopOpportunities";

/* ===== ENGINE ===== */
import { runCrypto15mEngine } from "../engine/Crypto15mSignalEngine";

export default function Dashboard() {
  useEffect(() => {
    runCrypto15mEngine();
    const interval = setInterval(runCrypto15mEngine, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 pb-16">

      {/* 1️⃣ CRYPTO 15-MIN SIGNALS */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Crypto 15-Minute Signals</h2>
        <Crypto15mSignalsPanel />
      </section>

      {/* 2️⃣ TRACTION & PERFORMANCE */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Traction & Signal Performance</h2>
        <TractionPanel />
      </section>

      {/* 3️⃣ PRICE + DEPTH */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Price Movement</h3>
          <PriceMovement />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Market Depth</h3>
          <MarketDepthPanel />
        </div>
      </section>

      {/* 4️⃣ LIQUIDITY HEATMAP */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Liquidity Heatmap</h2>
        <Heatmap />
      </section>

      {/* 5️⃣ HIGH-CONFIDENCE OPPORTUNITIES */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          🔥 High-Confidence Opportunities
        </h2>
        <TopOpportunities />
      </section>

    </div>
  );
}


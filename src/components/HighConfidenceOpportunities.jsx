import React from "react";
import CryptoSignalOpportunityCard from "./CryptoSignalOpportunityCard";

export default function HighConfidenceOpportunities({ signals }) {
  const activeSignals = signals.filter(
    s => s.timeframe === "15m" && s.state !== "RESOLVED"
  );

  if (!activeSignals.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">
        High-Confidence Opportunities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeSignals.map(signal => (
          <CryptoSignalOpportunityCard
            key={signal.id}
            signal={signal}
            onEnter={(s, side) => console.log("ENTER", s.id, side)}
            onSkip={(s) => console.log("SKIP", s.id)}
          />
        ))}
      </div>
    </section>
  );
}

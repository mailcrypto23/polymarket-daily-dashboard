import { useEffect, useState } from "react";

/* Live Gamma API (read-only) */
import { fetchLiveMarkets, calculateSpread } from "../../services/gammaApi";

/* Local mock fallback (inline, build-safe) */
const FALLBACK_MARKETS = [
  {
    id: "mock-1",
    question: "Fed Rate Cut (Jan)",
    yesPrice: 0.73,
    noPrice: 0.27,
    slug: "fed-rate-cut-jan"
  },
  {
    id: "mock-2",
    question: "ETH ETF Approval",
    yesPrice: 0.58,
    noPrice: 0.42,
    slug: "eth-etf-approval"
  }
];

export default function SpreadScanner() {
  const [markets, setMarkets] = useState([]);
  const [source, setSource] = useState("mock");

  useEffect(() => {
    let active = true;

    async function loadMarkets() {
      const live = await fetchLiveMarkets({ limit: 10 });

      if (!active) return;

      if (Array.isArray(live) && live.length > 0) {
        setMarkets(live);
        setSource("live");
      } else {
        setMarkets(FALLBACK_MARKETS);
        setSource("mock");
      }
    }

    loadMarkets();
    const interval = setInterval(loadMarkets, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-2 text-sm">
      <div className="text-xs opacity-60">
        Data source: {source === "live" ? "Live Polymarket" : "Mock"}
      </div>

      {markets.map((m) => {
        const spread = calculateSpread(m);
        if (spread == null) return null;

        return (
          <div key={m.id} className="flex justify-between items-center">
            <span className="truncate max-w-[65%]">
              {m.question}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-green-400">
                {(spread * 100).toFixed(2)}%
              </span>

              {m.slug && (
                <a
                  href={`https://polymarket.com/event/${m.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline opacity-70 hover:opacity-100"
                >
                  Trade →
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

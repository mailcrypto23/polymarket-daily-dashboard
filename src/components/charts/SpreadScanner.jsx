import { useEffect, useState } from "react";

/* Live Gamma API */
import { fetchLiveMarkets, calculateSpread } from "../../services/gammaApi";

/* Mock fallback */
import { mockMarkets } from "../../services/mock-api";

export default function SpreadScanner() {
  const [markets, setMarkets] = useState([]);
  const [source, setSource] = useState("mock");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const live = await fetchLiveMarkets({ limit: 10 });

      if (!mounted) return;

      if (live && live.length > 0) {
        setMarkets(live);
        setSource("live");
      } else {
        setMarkets(mockMarkets || []);
        setSource("mock");
      }
    }

    load();
    const id = setInterval(load, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(id);
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
          <div
            key={m.id}
            className="flex justify-between items-center"
          >
            <span className="truncate max-w-[60%]">
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
/  `

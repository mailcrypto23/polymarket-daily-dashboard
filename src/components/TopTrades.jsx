import { useEffect, useState } from "react";
import { fetchActiveMarkets } from "../utils/api";

export default function TopTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let markets = [];
      let offset = 0;

      while (markets.length < 100 && offset < 200) {
        const batch = await fetchActiveMarkets(50, offset);
        if (!batch.length) break;
        markets = markets.concat(batch);
        offset += 50;
      }

      const filtered = markets
        .map(m => {
          if (!m.outcomePrices || !m.outcomes) return null;
          const probs = m.outcomePrices.map(Number);
          const max = Math.max(...probs);
          if (max < 0.7) return null;

          return {
            id: m.id,
            question: m.question,
            side: m.outcomes[probs.indexOf(max)],
            winRate: Math.round(max * 100),
            slug: m.slug
          };
        })
        .filter(Boolean)
        .slice(0, 10);

      setTrades(filtered);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="rounded-xl bg-white/5 p-4">
      <h3 className="text-xl font-bold mb-3">
        Top 10 High-Probability Markets (Public API)
      </h3>

      {loading ? (
        <p className="text-white/50">Loading…</p>
      ) : trades.length === 0 ? (
        <p className="text-white/50">No ≥70% markets right now.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/70">
              <th>Market</th>
              <th>Side</th>
              <th>Implied</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(t => (
              <tr key={t.id} className="border-t border-white/10">
                <td>{t.question}</td>
                <td className="font-bold">{t.side}</td>
                <td>{t.winRate}%</td>
                <td>
                  <a
                    href={`https://polymarket.com/market/${t.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

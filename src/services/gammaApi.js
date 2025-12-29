/**
 * Polymarket Gamma Markets API
 * Public, read-only, no auth required
 * Used for live market prices, volume, liquidity
 */

const GAMMA_BASE = "https://gamma.api.polymarket.com";

/**
 * Fetch active Polymarket markets (live data)
 * Safe for client-side usage
 */
export async function fetchLiveMarkets({ limit = 50 } = {}) {
  try {
    const res = await fetch(
      `${GAMMA_BASE}/markets?active=true&limit=${limit}`
    );

    if (!res.ok) {
      throw new Error(`Gamma API error: ${res.status}`);
    }

    const data = await res.json();

    // Normalize data for dashboard usage
    return data.map(m => ({
      id: m.marketId,
      slug: m.slug,
      question: m.question,
      yesPrice: Number(m.yesTokenPrice ?? 0),
      noPrice: Number(m.noTokenPrice ?? 0),
      volume24h: Number(m.volume24h ?? 0),
      liquidity: Number(m.totalLiquidity ?? 0),
      updatedAt: Date.now()
    }));
  } catch (err) {
    console.error("[gammaApi] fetchLiveMarkets failed:", err);
    return null; // important: allows fallback to mock-api
  }
}

/**
 * Utility: calculate spread (used by scanners)
 */
export function calculateSpread(market) {
  if (!market) return null;
  return Math.abs(market.yesPrice - market.noPrice);
}

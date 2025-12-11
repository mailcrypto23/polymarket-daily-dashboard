// src/services/portfolio.js
// Simple portfolio fetcher: attempts to call API then fallback to demo.
const API = import.meta.env.VITE_POLY_API_URL || process.env.POLY_API_URL || "https://api.polymarket.example/v1";

export async function fetchPortfolio(address) {
  if (!address) return { positions: [], valueUSD: 0, pnlToday: 0 };
  try {
    const res = await fetch(`${API}/portfolio/${address}`);
    if (!res.ok) throw new Error("portfolio fetch failed");
    return await res.json();
  } catch (e) {
    console.warn("fetchPortfolio fallback", e);
    return {
      positions: [
        { market: "m1", size: 10, entryPrice: 0.5, currentPrice: 0.62 },
      ],
      valueUSD: 1234,
      pnlToday: 124
    };
  }
}

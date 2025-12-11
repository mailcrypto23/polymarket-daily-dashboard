// src/services/markets.js
// Fetch markets from Polymarket (or fallback sample data)

const API =
  import.meta.env.VITE_POLY_API_URL ||
  process.env.POLY_API_URL ||
  "https://gamma.polyapi.io/markets"; // Default public endpoint

export async function fetchMarkets() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed API");

    const data = await res.json();
    return data.markets || data;
  } catch (err) {
    console.warn("⚠️ Using fallback markets:", err);

    return [
      {
        id: "sample-1",
        question: "Will BTC close above $100k by year-end?",
        yesPrice: 0.42,
        volume24h: 53000,
      },
      {
        id: "sample-2",
        question: "Will ETH flip BTC by 2030?",
        yesPrice: 0.18,
        volume24h: 34000,
      },
    ];
  }
}

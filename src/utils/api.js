// Public Polymarket Gamma API (read-only)

const BASE_URL = "https://gamma-api.polymarket.com";

export async function fetchActiveMarkets(limit = 50, offset = 0) {
  try {
    const res = await fetch(
      `${BASE_URL}/markets?closed=false&limit=${limit}&offset=${offset}`
    );
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    console.error("Gamma API error:", e);
    return [];
  }
}

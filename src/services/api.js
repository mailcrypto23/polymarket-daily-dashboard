const USE_MOCK = true;

export async function fetchMarkets() {
  if (USE_MOCK) {
    const res = await fetch('/src/mock-data/markets.json');
    return res.json();
  }
  // Real fetch placeholder (implement real endpoint)
  return [];
}

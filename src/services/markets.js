// src/services/markets.js
// Returns markets list — tries API (if configured), otherwise returns local mock-data.

import mockMarkets from '../mock-data/markets.json';

const API = import.meta?.env?.VITE_POLY_API_URL || process.env.POLY_API_URL || '';

export async function fetchMarkets() {
  try {
    if (API) {
      const res = await fetch(`${API}/markets`);
      if (res.ok) {
        return await res.json();
      }
      // fallthrough to mock if API fails
    }
  } catch (e) {
    // ignore and fallback to mock
  }
  // local fallback
  return mockMarkets;
}

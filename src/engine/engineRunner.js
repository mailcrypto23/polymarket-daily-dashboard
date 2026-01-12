import { getLivePrice } from "./priceFeed";
import { runCrypto15mSignalEngine } from "./Crypto15mSignalEngine";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const ENGINE_TICK_MS = 2_000; // 2s cadence

let started = false;

export function startCryptoSignalEngine() {
  if (started) return;
  started = true;

  async function tick() {
    const livePrices = {};

    for (const asset of ASSETS) {
      try {
        livePrices[asset] = await getLivePrice(asset);
      } catch (err) {
        console.warn(`Price fetch failed for ${asset}`, err);
      }
    }

    runCrypto15mSignalEngine(livePrices);
  }

  // run once immediately
  tick();

  // continue polling
  setInterval(tick, ENGINE_TICK_MS);
}

import { getLivePrice } from "./priceFeed";
import { runCrypto15mSignalEngine } from "./Crypto15mSignalEngine";
import {
  startBinancePriceFeed,
  getBinancePrices,
} from "./binancePriceFeed";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const ENGINE_TICK_MS = 1_000; // 1s engine tick

let started = false;

export function startCryptoSignalEngine() {
  if (started) return;
  started = true;

  // 🔴 start WebSocket feed
  startBinancePriceFeed();

  async function tick() {
    const livePrices = getBinancePrices();

    // 🟡 fallback to CoinGecko if Binance missing
    for (const asset of ASSETS) {
      if (!livePrices[asset]) {
        try {
          livePrices[asset] = await getLivePrice(asset);
        } catch (e) {
          console.warn(`Fallback price failed for ${asset}`, e);
        }
      }
    }

    runCrypto15mSignalEngine(livePrices);
  }

  tick();
  setInterval(tick, ENGINE_TICK_MS);
}

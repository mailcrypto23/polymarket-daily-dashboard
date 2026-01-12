/**
 * confidenceEngine.ts
 *
 * Implements real probabilistic confidence model for 15m signals
 * per design in ChatGPT shared session:
 * https://chatgpt.com/share/6964f92e-eab0-8002-94a9-cf68cae6257a
 *
 * Combines momentum, trend, volatility, liquidity, time decay
 * into a defensible, builder-safe probabilistic estimate.
 */

import { EMA, stdDev, logReturns, clamp, sigmoid } from './mathUtils';

/**
 * Compute confidence given price history and market context
 * @param {number[]} prices - recent mid-prices
 * @param {number} bid - current best bid (for liquidity)
 * @param {number} ask - current best ask (for liquidity)
 * @param {'UP'|'DOWN'} direction - predicted direction of signal
 * @param {number} secondsRemaining - seconds until resolve
 * @returns number - confidence probability (0.52–0.88)
 */
export function computeConfidence({
  prices,
  bid,
  ask,
  direction,
  secondsRemaining
}: {
  prices: number[],
  bid: number,
  ask: number,
  direction: 'UP' | 'DOWN',
  secondsRemaining: number
}): number {

  // 1) Momentum score (short-term directional pressure)
  const pNow = prices.at(-1) ?? 0;
  const p30 = prices.at(-30) ?? pNow;
  const momentum = (pNow - p30) / (p30 || 1);
  const momentumScore = clamp(momentum / 0.0015, -1, 1);

  // 2) Trend alignment (fast vs slow EMA)
  const emaFast = EMA(prices, 15);
  const emaSlow = EMA(prices, 60);
  const trend = (emaFast - emaSlow) / (emaSlow || 1);
  const trendScore = clamp(trend / 0.002, -1, 1);

  // 3) Volatility penalty (log return std deviation)
  const vol = stdDev(logReturns(prices));
  const volScore = clamp(1 - vol / 0.0025, 0, 1);

  // 4) Liquidity confirmation (spread-based)
  const mid = (ask + bid) / 2;
  const spread = ask && bid ? ask - bid : 0;
  const liqScore = clamp(1 - (spread / (mid || 1)) / 0.0005, 0, 1);

  // 5) Time decay
  const timeRatio = secondsRemaining / 900; // 15m -> 900s
  const timeScore = Math.pow(timeRatio, 0.6);

  // 6) Direction multiplier
  const dirMultiplier =
    direction === 'UP'
      ? momentumScore > 0 ? 1 : -1
      : momentumScore < 0 ? 1 : -1;

  // 7) Weighted aggregation
  const raw =
    0.35 * momentumScore +
    0.25 * trendScore +
    0.15 * volScore +
    0.15 * liqScore;

  const adjusted = raw * dirMultiplier;

  // 8) Sigmoid probability + final clamp
  const confidence = sigmoid(adjusted * 2.2) * timeScore;
  return clamp(confidence, 0.52, 0.88);
}

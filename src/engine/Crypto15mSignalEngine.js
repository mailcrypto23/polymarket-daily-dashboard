/* =========================================================
   Crypto 15m Signal Engine — FINAL (STABLE)
========================================================= */

import { getLivePrice } from "./priceFeed";
import { getPolymarketOdds } from "./polymarketOddsFeed";
import { calculateEdge } from "./edgeCalculator";
import { calibrateConfidence } from "./confidenceCalibrator";
import { isTradeableRegime } from "./regimeFilter";
import { getDrawdownState } from "./drawdownGuard";
import { kellySize } from "./kellySizing";
import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = import.meta.env.DEV ? 60_000 : 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;
const STAKE = 1;
const EDGE_THRESHOLD = 0.06;

const engineState = {};
for (const a of ASSETS) {
  engineState[a] = { activeSignal: null, history: [], recentPrices: [] };
}

const now = () => Date.now();
const id = s => `${s}-15m-${Date.now()}`;

async function createSignal(symbol) {
  const createdAt = now();
  let price = await getLivePrice(symbol);
  if (!Number.isFinite(price)) price = 0;

  const confidence = calibrateConfidence(0.74);

  return {
    id: id(symbol),
    symbol,
    confidence,
    direction: confidence >= 0.5 ? "UP" : "DOWN",
    createdAt,
    resolveAt: createdAt + TIMEFRAME_MS,
    entryClosesAt: createdAt + TIMEFRAME_MS * SAFE_ENTRY_RATIO,
    entryOpen: true,
    priceAtSignal: price,
    priceAtEntry: null,
    priceAtResolve: null,
    marketProbability: null,
    edge: 0,
    mispriced: false,
    regimeOK: true,
    drawdownBlocked: false,
    kellyFraction: 0,
    pnl: 0,
    result: null,
    userAction: null,
    entryDelayMs: null,
    resolved: false,
    explanation: [],
  };
}

function resolveSignal(s) {
  const won =
    s.direction === "UP"
      ? s.priceAtResolve > s.priceAtEntry
      : s.priceAtResolve < s.priceAtEntry;

  s.result = won ? "WIN" : "LOSS";
  if (s.userAction === "ENTER" && s.marketProbability) {
    const p = s.marketProbability;
    s.pnl = Number(((won ? 1 / p - 1 : -1) * STAKE).toFixed(4));
  }
  s.resolved = true;
}

export async function runCrypto15mSignalEngine() {
  const t = now();
  const drawdown = getDrawdownState();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let s = state.activeSignal;

    const price = await getLivePrice(asset);
    if (Number.isFinite(price)) {
      state.recentPrices.push(price);
      if (state.recentPrices.length > 30) state.recentPrices.shift();
    }

    if (!s) {
      state.activeSignal = await createSignal(asset);
      continue;
    }

    if (!s.marketProbability) {
      const odds = await getPolymarketOdds(asset);
      if (odds) {
        s.marketProbability = odds.marketProb;
        const e = calculateEdge({
          confidence: s.confidence,
          marketProb: odds.marketProb,
        });
        s.edge = e?.edge ?? 0;
        s.mispriced = s.edge >= EDGE_THRESHOLD;
        s.regimeOK = isTradeableRegime(state.recentPrices);
        s.drawdownBlocked = drawdown.blocked;
        s.kellyFraction =
          s.mispriced && s.regimeOK && !s.drawdownBlocked
            ? kellySize({ edge: s.edge, odds: 1 / odds.marketProb })
            : 0;
      }
    }

    if (!s.resolved && t >= s.resolveAt) {
      s.priceAtResolve = await getLivePrice(asset);
      s.priceAtEntry ||= s.priceAtSignal;
      resolveSignal(s);
      state.history.unshift(s);
      persistResolvedSignal(s);
      state.activeSignal = await createSignal(asset);
    }
  }
}

export function enterSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen || s.drawdownBlocked || !s.regimeOK) return false;
  s.userAction = "ENTER";
  s.entryDelayMs = now() - s.createdAt;
  s.priceAtEntry = s.priceAtSignal;
  return true;
}

export function skipSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;
  s.userAction = "SKIP";
  s.entryOpen = false;
  return true;
}

export function getActive15mSignals() {
  const out = {};
  for (const a of ASSETS) out[a] = engineState[a].activeSignal;
  return out;
}

export function getLastResolvedSignals(limit = 50) {
  return loadResolvedSignals().slice(0, limit);
}

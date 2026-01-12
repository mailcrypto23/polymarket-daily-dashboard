/* =========================================================
   CONFIG
========================================================= */

import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

import { getLivePrice } from "./priceFeed";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;

const VIRTUAL_POSITION_USD = 100;

// minimum edge to alert (8%+ is meaningful)
const MIN_EDGE = 0.08;

/* =========================================================
   ENGINE STATE
========================================================= */

const engineState = {};

for (const asset of ASSETS) {
  engineState[asset] = {
    activeSignal: null,
    history: [],
  };
}

/* =========================================================
   UTILITIES
========================================================= */

const now = () => Date.now();

const generateId = symbol =>
  `${symbol}-15m-${Date.now()}`;

const randomDirection = () =>
  Math.random() > 0.5 ? "UP" : "DOWN";

/* =========================================================
   MARKET PROBABILITY (APPROX)
========================================================= */

/**
 * Temporary approximation until Polymarket odds / orderbook is wired.
 * Maps short-term price bias → implied probability.
 */
function estimateMarketProbability(direction, priceMovePct) {
  const base = 0.5;
  const bias = Math.min(Math.abs(priceMovePct) * 5, 0.15); // cap bias

  return direction === "UP"
    ? base + bias
    : base - bias;
}

/* =========================================================
   CREATE SIGNAL
========================================================= */

async function createSignal(symbol) {
  const start = now();
  const price = await getLivePrice(symbol);

  const breakdown = {
    momentum: Math.round(70 + Math.random() * 20),
    trend: Math.round(65 + Math.random() * 20),
    volatility: Math.round(60 + Math.random() * 25),
    liquidity: Math.round(65 + Math.random() * 20),
    timePenalty: 0,
  };

  const avg =
    (breakdown.momentum +
      breakdown.trend +
      breakdown.volatility +
      breakdown.liquidity) / 4;

  breakdown.finalConfidence = Math.round(avg);
  const modelConfidence = breakdown.finalConfidence / 100;

  // simulate short-term bias proxy
  const priceBiasPct = (Math.random() - 0.5) * 0.02;

  const direction = randomDirection();
  const marketProb = estimateMarketProbability(
    direction,
    priceBiasPct
  );

  const edge = modelConfidence - marketProb;

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction,

    priceAtCreation: price,
    priceAtResolve: null,

    confidence: modelConfidence,
    marketProbability: Number(marketProb.toFixed(3)),
    edgePct: Number((edge * 100).toFixed(2)),
    mispriced: edge >= MIN_EDGE,

    confidenceBreakdown: breakdown,

    createdAt: start,
    entryAt: null,
    entryDelayMs: null,

    resolveAt: start + TIMEFRAME_MS,
    entryClosesAt: start + TIMEFRAME_MS * SAFE_ENTRY_RATIO,

    pnlPct: null,
    pnlUsd: null,

    entryOpen: true,
    resolved: false,
    result: null,
    userAction: null,
  };
}

/* =========================================================
   RESOLUTION (REAL PnL)
========================================================= */

async function resolveSignal(signal) {
  const closePrice = await getLivePrice(signal.symbol);
  signal.priceAtResolve = closePrice;

  const entry = signal.priceAtCreation;
  const movePct = (closePrice - entry) / entry;

  const dirMult = signal.direction === "UP" ? 1 : -1;
  const pnlPct = movePct * dirMult;
  const pnlUsd = pnlPct * VIRTUAL_POSITION_USD;

  signal.pnlPct = Number((pnlPct * 100).toFixed(2));
  signal.pnlUsd = Number(pnlUsd.toFixed(2));
  signal.result = pnlUsd >= 0 ? "WIN" : "LOSS";
  signal.resolved = true;
}

/* =========================================================
   ENGINE TICK
========================================================= */

export async function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    const signal = state.activeSignal;

    if (!signal) {
      state.activeSignal = await createSignal(asset);
      continue;
    }

    if (signal.entryOpen && t >= signal.entryClosesAt) {
      signal.entryOpen = false;
      signal.confidenceBreakdown.timePenalty = 5;
    }

    if (!signal.resolved && t >= signal.resolveAt) {
      await resolveSignal(signal);

      state.history.unshift(signal);
      state.history = state.history.slice(0, 50);

      persistResolvedSignal(signal);
      state.activeSignal = await createSignal(asset);
    }
  }
}

/* =========================================================
   SELECTORS
========================================================= */

export function getMispricedSignals(minEdge = MIN_EDGE) {
  return Object.values(engineState)
    .map(s => s.activeSignal)
    .filter(
      s =>
        s &&
        s.entryOpen &&
        s.mispriced &&
        s.edgePct / 100 >= minEdge
    );
}

export function getActive15mSignals() {
  const out = {};
  for (const a of ASSETS) out[a] = engineState[a].activeSignal;
  return out;
}

export function getLastResolvedSignals(limit = 50) {
  const persisted = loadResolvedSignals();

  const inMemory = Object.values(engineState)
    .flatMap(s => s.history)
    .filter(s => s.resolved);

  return [...persisted, ...inMemory]
    .reduce((acc, s) => {
      if (!acc.find(x => x.id === s.id)) acc.push(s);
      return acc;
    }, [])
    .sort((a, b) => b.resolveAt - a.resolveAt)
    .slice(0, limit);
}

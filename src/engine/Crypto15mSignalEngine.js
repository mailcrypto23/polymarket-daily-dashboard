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
   CREATE SIGNAL (LIVE PRICE WIRED)
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

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction: randomDirection(),

    // 🔴 LIVE PRICE SNAPSHOTS
    priceAtCreation: price,
    priceAtResolve: null,

    confidence: breakdown.finalConfidence / 100,
    confidenceBreakdown: breakdown,

    createdAt: start,
    entryAt: null,
    entryDelayMs: null,

    resolveAt: start + TIMEFRAME_MS,
    entryClosesAt: start + TIMEFRAME_MS * SAFE_ENTRY_RATIO,

    entryOpen: true,
    resolved: false,
    result: null,
    userAction: null,
  };
}

/* =========================================================
   RESOLUTION (LIVE PRICE AT CLOSE)
========================================================= */

async function resolveSignal(signal) {
  signal.priceAtResolve = await getLivePrice(signal.symbol);
  signal.resolved = true;

  signal.result =
    Math.random() < signal.confidence ? "WIN" : "LOSS";
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

      // 🔐 persist full signal incl. prices
      persistResolvedSignal(signal);

      state.activeSignal = await createSignal(asset);
    }
  }
}

/* =========================================================
   USER ACTIONS
========================================================= */

export function enterSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;

  s.userAction = "ENTER";
  s.entryAt = now();
  s.entryDelayMs = s.entryAt - s.createdAt;

  return true;
}

export function skipSignal(symbol) {
  const s = engineState[symbol]?.activeSignal;
  if (!s || !s.entryOpen) return false;

  s.userAction = "SKIP";
  s.entryOpen = false;
  return true;
}

/* =========================================================
   SELECTORS (USED BY ANALYTICS)
========================================================= */

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

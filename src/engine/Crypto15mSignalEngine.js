/* =========================================================
   CONFIG
========================================================= */

import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = 15 * 60 * 1000;
const SAFE_ENTRY_RATIO = 0.4;

const BASE_CONFIDENCE_RANGE = [0.62, 0.82];
const LATE_ENTRY_PENALTY = 0.05;

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

const clamp = (v, min, max) =>
  Math.min(Math.max(v, min), max);

/* =========================================================
   CONFIDENCE MODEL (TIME + STRUCTURE ONLY)
========================================================= */

function computeInitialConfidence() {
  return (
    BASE_CONFIDENCE_RANGE[0] +
    Math.random() *
      (BASE_CONFIDENCE_RANGE[1] - BASE_CONFIDENCE_RANGE[0])
  );
}

function applyTimeDecay(confidence, createdAt, resolveAt) {
  const elapsed = now() - createdAt;
  const total = resolveAt - createdAt;
  const ratio = clamp(elapsed / total, 0, 1);

  // non-linear decay
  const decay = Math.pow(ratio, 0.7) * 0.08;

  return clamp(confidence - decay, 0.55, 0.88);
}

/* =========================================================
   CREATE SIGNAL
========================================================= */

function createSignal(symbol) {
  const start = now();
  const baseConfidence = computeInitialConfidence();

  const breakdown = {
    momentum: Math.round(baseConfidence * 100),
    trend: Math.round(baseConfidence * 100),
    volatility: Math.round(baseConfidence * 100),
    liquidity: Math.round(baseConfidence * 100),
    timePenalty: 0,
    finalConfidence: Math.round(baseConfidence * 100),
  };

  return {
    id: generateId(symbol),
    symbol,
    timeframe: "15m",
    direction: randomDirection(),

    confidence: baseConfidence,
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
   RESOLUTION (DETERMINISTIC)
========================================================= */

function resolveSignal(signal) {
  signal.resolved = true;

  // deterministic resolution based on confidence threshold
  signal.result =
    signal.confidence >= 0.65 ? "WIN" : "LOSS";
}

/* =========================================================
   ENGINE TICK
========================================================= */

export function runCrypto15mSignalEngine() {
  const t = now();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    const signal = state.activeSignal;

    if (!signal) {
      state.activeSignal = createSignal(asset);
      continue;
    }

    // 🔒 entry window close
    if (signal.entryOpen && t >= signal.entryClosesAt) {
      signal.entryOpen = false;
      signal.confidenceBreakdown.timePenalty = 5;
      signal.confidence = clamp(
        signal.confidence - LATE_ENTRY_PENALTY,
        0.55,
        0.88
      );
    }

    // ⏱ time-based confidence decay
    signal.confidence = applyTimeDecay(
      signal.confidence,
      signal.createdAt,
      signal.resolveAt
    );

    signal.confidenceBreakdown.finalConfidence =
      Math.round(signal.confidence * 100);

    // ⏹ resolve
    if (!signal.resolved && t >= signal.resolveAt) {
      resolveSignal(signal);

      state.history.unshift(signal);
      state.history = state.history.slice(0, 50);

      persistResolvedSignal(signal);
      state.activeSignal = createSignal(asset);
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
   SELECTORS
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

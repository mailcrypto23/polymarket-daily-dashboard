/* =========================================================
   Crypto 15m Signal Lifecycle Engine — FINAL (READ-ONLY)
   Analytics only · No execution · No simulation
========================================================= */

import { getLivePrice } from "./priceFeed";
import { getPolymarketOdds } from "./polymarketOddsFeed";
import { calculateEdge } from "./edgeCalculator";
import { calibrateConfidence } from "./confidenceCalibrator";
import { isTradeableRegime } from "./regimeFilter";
import { getDrawdownState } from "./drawdownGuard";
import {
  persistResolvedSignal,
  loadResolvedSignals,
} from "./signalPersistence";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];
const TIMEFRAME_MS = import.meta.env.DEV ? 60_000 : 15 * 60 * 1000;
const SAFE_WINDOW_RATIO = 0.4;
const EDGE_THRESHOLD = 0.06;

const engineState = {};
for (const a of ASSETS) {
  engineState[a] = { active: null, history: [], recentPrices: [] };
}

const now = () => Date.now();
const uid = s => `${s}-15m-${Date.now()}`;

async function createSignal(symbol) {
  const createdAt = now();
  const price = (await getLivePrice(symbol)) ?? null;

  const confidence = calibrateConfidence(0.74);

  return {
    id: uid(symbol),
    symbol,
    confidence,
    bias: confidence >= 0.5 ? "LEANS_YES" : "LEANS_NO",

    createdAt,
    observeUntil: createdAt + TIMEFRAME_MS,
    safeWindowEndsAt: createdAt + TIMEFRAME_MS * SAFE_WINDOW_RATIO,

    priceAtStart: price,
    priceAtObservation: null,

    marketProbability: null,
    edge: 0,
    mispriced: false,
    regimeOK: true,
    drawdownBlocked: false,

    userNote: null,          // acknowledge / dismiss
    observationDelayMs: null,

    resolved: false,
    outcome: null,           // RESOLVED_UP / RESOLVED_DOWN
    explanation: [],
  };
}

function resolveObservation(s) {
  if (!Number.isFinite(s.priceAtObservation) || !Number.isFinite(s.priceAtStart))
    return;

  s.outcome =
    s.priceAtObservation > s.priceAtStart
      ? "RESOLVED_UP"
      : "RESOLVED_DOWN";

  s.resolved = true;
}

export async function runCrypto15mSignalEngine() {
  const t = now();
  const drawdown = getDrawdownState();

  for (const asset of ASSETS) {
    const state = engineState[asset];
    let s = state.active;

    const price = await getLivePrice(asset);
    if (Number.isFinite(price)) {
      state.recentPrices.push(price);
      if (state.recentPrices.length > 30) state.recentPrices.shift();
    }

    if (!s) {
      state.active = await createSignal(asset);
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
      }
    }

    if (!s.resolved && t >= s.observeUntil) {
      s.priceAtObservation = await getLivePrice(asset);
      resolveObservation(s);
      state.history.unshift(s);
      persistResolvedSignal(s);
      state.active = await createSignal(asset);
    }
  }
}

/* ---------- Read-only user interaction ---------- */

export function acknowledgeSignal(symbol) {
  const s = engineState[symbol]?.active;
  if (!s) return false;
  s.userNote = "ACKNOWLEDGED";
  s.observationDelayMs = now() - s.createdAt;
  return true;
}

export function dismissSignal(symbol) {
  const s = engineState[symbol]?.active;
  if (!s) return false;
  s.userNote = "DISMISSED";
  return true;
}

/* ---------- Selectors ---------- */

export function getActive15mSignals() {
  const out = {};
  for (const a of ASSETS) out[a] = engineState[a].active;
  return out;
}

export function getLastResolvedSignals(limit = 50) {
  return loadResolvedSignals().slice(0, limit);
}

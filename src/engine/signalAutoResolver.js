import { getLivePrice } from "./priceFeed";
import { simulatePnL } from "./pnlSimulator";
import { logSignalOutcome } from "./signalLogger";

const STORAGE_KEY = "pm_signal_history";

export function runSignalAutoResolver() {
  if (typeof window === "undefined") return;

  let signals = [];
  try {
    signals = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return;
  }

  const now = Date.now();
  let changed = false;

  const next = signals.map(s => {
    if (
      s.outcome !== "pending" ||
      s.userDecision !== "ENTER" ||
      s.confidence < 70
    ) {
      return s;
    }

    const price = getLivePrice(s.asset);
    if (!price) return s;

    const pnl = simulatePnL(s, price);

    if (pnl >= s.takeProfit) {
      changed = true;
      logSignalOutcome(s, "WIN", pnl);
      return { ...s, outcome: "win", pnl, exitPrice: price };
    }

    if (pnl <= -s.stopLoss) {
      changed = true;
      logSignalOutcome(s, "LOSS", pnl);
      return { ...s, outcome: "loss", pnl, exitPrice: price };
    }

    if (now >= s.resolveAt) {
      changed = true;
      logSignalOutcome(s, "TIMEOUT", pnl);
      return { ...s, outcome: "timeout", pnl, exitPrice: price };
    }

    return s;
  });

  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

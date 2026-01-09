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
  let updated = false;

  const nextSignals = signals.map(signal => {
    if (
      signal.outcome !== "pending" ||
      signal.userDecision !== "ENTER"
    ) {
      return signal;
    }

    const price = getLivePrice(signal.asset);
    if (!price) return signal;

    const pnl = simulatePnL(signal, price);

    if (pnl >= signal.takeProfit) {
      updated = true;
      logSignalOutcome(signal, "WIN", pnl);
      return { ...signal, outcome: "win", pnl };
    }

    if (pnl <= -signal.stopLoss) {
      updated = true;
      logSignalOutcome(signal, "LOSS", pnl);
      return { ...signal, outcome: "loss", pnl };
    }

    if (now >= signal.resolveAt) {
      updated = true;
      logSignalOutcome(signal, "TIME", pnl);
      return { ...signal, outcome: "timeout", pnl };
    }

    return signal;
  });

  if (updated) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextSignals)
    );
  }
}

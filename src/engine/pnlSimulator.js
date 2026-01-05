// PnL Simulator v1 – SAFE, CSV-compatible
// Assumes Polymarket-style binary bets

const STAKE_USD = 10;      // per trade
const WIN_PAYOUT = 9;     // net profit on win
const LOSS_PAYOUT = -10;  // loss on lose

export function simulatePnL(signals, options = {}) {
  const {
    minConfidence = 55,
    includePending = false,
  } = options;

  const filtered = signals.filter(s => {
    if (!includePending && !s.outcome) return false;
    if (s.confidence < minConfidence) return false;
    return true;
  });

  let wins = 0;
  let losses = 0;
  let pnl = 0;

  const equityCurve = [];

  filtered.forEach(s => {
    if (s.outcome === "win") {
      wins++;
      pnl += WIN_PAYOUT;
    } else if (s.outcome === "loss") {
      losses++;
      pnl += LOSS_PAYOUT;
    }
    equityCurve.push(pnl);
  });

  const trades = wins + losses;
  const winRate = trades > 0 ? (wins / trades) * 100 : 0;
  const expectancy = trades > 0 ? pnl / trades : 0;

  return {
    trades,
    wins,
    losses,
    winRate: Number(winRate.toFixed(2)),
    netPnL: Number(pnl.toFixed(2)),
    expectancy: Number(expectancy.toFixed(2)),
    equityCurve,
  };
}

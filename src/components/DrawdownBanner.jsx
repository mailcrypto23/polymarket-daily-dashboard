import { getDrawdownState } from "../engine/drawdownGuard";

export default function DrawdownBanner() {
  const { blocked, dayPnL, weekPnL } = getDrawdownState();

  if (!blocked) return null;

  return (
    <div className="rounded-xl bg-red-700/20 border border-red-500 p-4 text-red-300 text-sm font-semibold">
      ⛔ Trading paused due to drawdown limits
      <div className="text-xs mt-1 opacity-80">
        Daily PnL: {(dayPnL * 100).toFixed(2)}% · Weekly PnL: {(weekPnL * 100).toFixed(2)}%
      </div>
    </div>
  );
}

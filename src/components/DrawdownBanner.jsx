import { getDrawdownState } from "../engine/drawdownGuard";

export default function DrawdownBanner() {
  const state = getDrawdownState();

  if (!state.blocked) return null;

  return (
    <div className="mb-4 rounded-xl bg-red-700/20 border border-red-500 p-4 text-red-300 text-sm font-semibold">
      ⛔ Trading paused — drawdown limit reached  
      <div className="text-xs opacity-80 mt-1">
        Current drawdown: {(state.drawdown * 100).toFixed(1)}%
      </div>
    </div>
  );
}

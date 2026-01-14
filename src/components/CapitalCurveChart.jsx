import { getCapitalCurve } from "../engine/capitalCurve";

export default function CapitalCurveChart() {
  const { curve, start, end } = getCapitalCurve();

  if (!curve.length) {
    return (
      <div className="rounded-xl bg-black/40 p-4 text-white/40 text-sm">
        No resolved trades yet
      </div>
    );
  }

  const max = Math.max(...curve.map(p => p.capital));
  const min = Math.min(...curve.map(p => p.capital));

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="text-sm text-white mb-2 font-semibold">
        Capital Curve (Simulated)
      </div>

      <div className="text-xs text-white/60 mb-3">
        Start: {start.toFixed(2)} → Current: {end.toFixed(2)}
      </div>

      <div className="flex items-end gap-[2px] h-24">
        {curve.map((p, i) => {
          const h =
            max > min
              ? ((p.capital - min) / (max - min)) * 100
              : 50;

          return (
            <div
              key={i}
              className="flex-1 bg-purple-500/70 rounded-sm"
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

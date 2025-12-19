export default function AISignalStrip({ market = "ETH" }) {
  return (
    <div className="mt-2 inline-flex items-center gap-3
                    rounded-full px-4 py-1 text-xs
                    bg-emerald-500/10 text-emerald-300
                    border border-emerald-500/20">
      <span className="font-semibold">{market}</span>
      <span>YES liquidity dominant</span>
      <span>Whale bias ↑</span>
      <span className="text-emerald-400 font-semibold">Confidence 78%</span>
    </div>
  );
}

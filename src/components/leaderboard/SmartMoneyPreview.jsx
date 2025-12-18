export default function SmartMoneyPreview() {
  const rows = [
    { rank: "🥇", trader: "AlphaWhale", market: "ETH ETF", pnl: "+$42k", signal: "🟢" },
    { rank: "🥈", trader: "MacroFund", market: "Fed Cut", pnl: "+$18k", signal: "🟢" },
    { rank: "🥉", trader: "QuantX", market: "BTC > $100k", pnl: "+$9k", signal: "🟡" },
  ];

  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/60
                    border border-white/10 backdrop-blur text-xs text-white w-[300px]">
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold">🏆 Smart Money</h4>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 rounded">
          Preview
        </span>
      </div>

      <div className="space-y-1">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{r.rank} {r.trader}</span>
            <span className="opacity-70">{r.market}</span>
            <span className="text-emerald-400">{r.pnl}</span>
            <span>{r.signal}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] opacity-50 mt-2">
        Liquidity-weighted · demo data
      </p>
    </div>
  );
}

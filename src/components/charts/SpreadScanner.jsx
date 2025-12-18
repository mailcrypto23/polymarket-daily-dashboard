const spreads = [
  { market: "Fed Rate Cut (Jan)", yes: 0.73, no: 0.27 },
  { market: "Trump VP Pick", yes: 0.61, no: 0.39 },
  { market: "ETH ETF Approval", yes: 0.58, no: 0.42 },
  { market: "Ukraine Ceasefire", yes: 0.68, no: 0.32 },
  { market: "BTC > $100k", yes: 0.41, no: 0.59 },
  { market: "AI Time POTY", yes: 0.96, no: 0.04 },
];

export default function SpreadScanner() {
  return (
    <div className="space-y-2">
      {spreads.map((s) => {
        const spread = Math.abs(s.yes - s.no) * 100;
        return (
          <div key={s.market} className="flex justify-between text-sm">
            <span>{s.market}</span>
            <span className="text-green-400">
              {spread.toFixed(0)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

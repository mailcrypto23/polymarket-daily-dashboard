const spreads = [
  { pair: "ETH/USDT", spread: "0.12%" },
  { pair: "BTC/USDT", spread: "0.08%" },
  { pair: "SOL/USDT", spread: "0.21%" },
];

export default function SpreadScanner() {
  return (
    <div className="space-y-2">
      {spreads.map((s) => (
        <div
          key={s.pair}
          className="flex justify-between bg-premiumDark px-3 py-2 rounded"
        >
          <span>{s.pair}</span>
          <span className="text-green-400">{s.spread}</span>
        </div>
      ))}
    </div>
  );
}

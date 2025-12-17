export default function MarketSelector({ value, onChange }) {
  const markets = ["ETH", "BTC", "SOL", "XRP"];

  return (
    <div className="flex gap-2 mb-4">
      {markets.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1 rounded text-sm ${
            value === m
              ? "bg-purple-600"
              : "bg-premiumCard opacity-70"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

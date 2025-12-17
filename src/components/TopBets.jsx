const bets = [
  { q: "BTC above $40k this week?", yes: 97 },
  { q: "ETH ETF approved in 2024?", yes: 96 },
  { q: "US Fed no rate hike next meeting?", yes: 98 },
  { q: "SOL above $150 by month end?", yes: 95 },
  { q: "Trump wins GOP primary?", yes: 97 },
];

export default function TopBets() {
  return (
    <div className="space-y-3">
      {bets.map((b, i) => (
        <div
          key={i}
          className="bg-premiumCard p-4 rounded-lg flex justify-between"
        >
          <span>{b.q}</span>
          <span className="text-green-400 font-semibold">
            YES {b.yes}%
          </span>
        </div>
      ))}
    </div>
  );
}

const bets = [
  { title: "Time Person of the Year — AI", chance: 96, vol: "$53M" },
  { title: "Fed rate cut in January", chance: 73, vol: "$36M" },
  { title: "Trump nominee confirmed", chance: 70, vol: "$18M" },
  { title: "Netflix acquisition closes", chance: 81, vol: "$12M" },
  { title: "Ukraine ceasefire in 2025", chance: 68, vol: "$22M" },
];

export default function TopOpportunities() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">
        🔥 High-Confidence Opportunities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {bets.map((b) => (
          <div key={b.title} className="bg-premiumCard rounded-xl p-4">
            <div className="text-sm font-medium mb-2">{b.title}</div>
            <div className="text-2xl font-bold text-green-400">
              {b.chance}%
            </div>
            <div className="text-xs opacity-70">Volume {b.vol}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

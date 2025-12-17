const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function MarketCarousel() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">
        ⏳ Upcoming & Ongoing Markets
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {markets.map((m) => (
          <div
            key={m.title}
            className="min-w-[280px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4"
          >
            <div className="text-sm opacity-80">{m.date}</div>
            <div className="text-lg font-semibold">{m.title}</div>
            <div className="mt-2 text-xs">{m.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

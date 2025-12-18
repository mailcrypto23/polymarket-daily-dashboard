const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
  { title: "CPI Inflation Report", date: "Apr 10", status: "Upcoming" },
  { title: "FOMC Minutes", date: "Apr 25", status: "Upcoming" },
];

const Card = ({ m }) => (
  <div className="relative mx-2 p-3 rounded-xl text-white
                  bg-gradient-to-r from-indigo-600/70 via-purple-600/70 to-violet-600/70">
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

    <div className="text-[10px] opacity-80">{m.date}</div>
    <div className="text-sm font-semibold">{m.title}</div>
    <div className="text-[10px] opacity-70 mb-2">{m.status}</div>

    <div className="flex gap-2">
      <button disabled className="flex-1 py-1 rounded-full text-[11px] bg-white/15 opacity-50">
        YES
      </button>
      <button disabled className="flex-1 py-1 rounded-full text-[11px] bg-black/20 opacity-50">
        NO
      </button>
    </div>
  </div>
);

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-4">

      {/* Ongoing */}
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50">
        Ongoing
      </h4>
      {markets.filter(m => m.status === "Ongoing").map(m => (
        <Card key={m.title} m={m} />
      ))}

      {/* Upcoming */}
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50 mt-4">
        Upcoming
      </h4>
      {markets.filter(m => m.status === "Upcoming").map(m => (
        <Card key={m.title} m={m} />
      ))}
    </div>
  );
}

const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-3">
      <h4 className="text-xs uppercase opacity-60 mb-2">
        Upcoming & Ongoing
      </h4>

      {markets.map((m) => (
        <div
          key={m.title}
          className="relative bg-premiumCard rounded-xl px-4 py-3 cursor-pointer hover:scale-[1.02] transition"
        >
          {/* Ticket cut */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-premiumDark rounded-full" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-premiumDark rounded-full" />

          <div className="text-xs opacity-70">{m.date}</div>
          <div className="text-sm font-medium">{m.title}</div>
          <div className="text-[10px] mt-1 opacity-60">
            {m.status}
          </div>
        </div>
      ))}
    </div>
  );
}

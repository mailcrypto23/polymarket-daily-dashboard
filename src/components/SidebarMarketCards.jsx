const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-2">
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50">
        Upcoming & Ongoing
      </h4>

      {markets.map((m) => (
        <div
          key={m.title}
          className="
            relative mx-2 px-3 py-2 rounded-lg
            bg-white/5 hover:bg-white/10
            cursor-pointer transition
          "
        >
          {/* Ticket cut (top) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2
                          w-3 h-3 bg-premiumDark rounded-full" />
          {/* Ticket cut (bottom) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2
                          w-3 h-3 bg-premiumDark rounded-full" />

          <div className="text-[10px] text-white/50">{m.date}</div>
          <div className="text-sm font-medium leading-tight text-white/90">
            {m.title}
          </div>
          <div className="text-[10px] text-white/40">
            {m.status}
          </div>
        </div>
      ))}
    </div>
  );
}

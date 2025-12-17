const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-3">
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50">
        Upcoming & Ongoing
      </h4>

      {markets.map((m) => (
        <div
          key={m.title}
          className="
            relative mx-2 p-3 rounded-xl text-white
            bg-gradient-to-r from-indigo-600/70 via-purple-600/70 to-violet-600/70
          "
        >
          {/* Ticket cut */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2
                       w-4 h-4 rounded-full"
            style={{ background: "#0b1220" }}
          />
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2
                       w-4 h-4 rounded-full"
            style={{ background: "#0b1220" }}
          />

          {/* Content */}
          <div className="text-[10px] opacity-80">{m.date}</div>
          <div className="text-sm font-semibold leading-tight">
            {m.title}
          </div>
          <div className="text-[10px] opacity-80 mb-2">
            {m.status}
          </div>

          {/* YES / NO (disabled) */}
          <div className="flex gap-2">
            <button
              disabled
              className="flex-1 py-1 rounded-full text-[11px] font-semibold
                         bg-white/15 text-white/50 cursor-not-allowed"
            >
              YES
            </button>
            <button
              disabled
              className="flex-1 py-1 rounded-full text-[11px] font-semibold
                         bg-black/20 text-white/50 cursor-not-allowed"
            >
              NO
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

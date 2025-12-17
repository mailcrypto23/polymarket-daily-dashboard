const markets = [
  { title: "Trump VP Pick", date: "Feb 3" },
  { title: "ETH ETF Approval", date: "Mar 15" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-3">
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50">
        Upcoming
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

          <div className="text-[10px] opacity-80">{m.date}</div>
          <div className="text-sm font-semibold leading-tight">
            {m.title}
          </div>

          {/* Disabled YES / NO */}
          <div className="mt-2 flex gap-2">
            <button
              disabled
              className="flex-1 py-1 rounded-full text-[11px]
                         bg-white/15 text-white/50 cursor-not-allowed"
            >
              YES
            </button>
            <button
              disabled
              className="flex-1 py-1 rounded-full text-[11px]
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

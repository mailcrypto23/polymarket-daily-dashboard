const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-6 space-y-3">
      {/* ===== Section label ===== */}
      <h4 className="px-3 text-[11px] uppercase tracking-wide text-white/50">
        Ongoing
      </h4>

      {/* ===== Market tickets ===== */}
      {markets.map((m) => (
        <div
          key={m.title}
          className="
            relative mx-2 p-3 rounded-xl text-white
            bg-gradient-to-r from-indigo-600/70 via-purple-600/70 to-violet-600/70
          "
        >
          {/* Ticket cut */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

          <div className="text-[10px] opacity-80">{m.date}</div>
          <div className="text-sm font-semibold leading-tight">
            {m.title}
          </div>

          {/* Status shown, but section is only “Ongoing” */}
          <div className="text-[10px] opacity-70 mb-2">
            {m.status}
          </div>

          {/* Disabled YES / NO */}
          <div className="flex gap-2">
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

      {/* ===== Last Trade (activity) ===== */}
      <div
        className="
          relative mx-2 p-3 rounded-xl text-white
          bg-gradient-to-r from-indigo-700/60 via-purple-700/60 to-violet-700/60
        "
      >
        {/* Ticket cut */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0b1220]" />

        <div className="text-[10px] opacity-80 mb-1">Last Trade</div>
        <div className="text-sm font-semibold">ETH / USDT</div>
        <div className="text-[11px] opacity-80">
          BUY · $3191.90 · 0.42 ETH
        </div>
      </div>
    </div>
  );
}

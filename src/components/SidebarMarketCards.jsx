const markets = [
  { title: "Fed Decision", date: "Jan 29", status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", status: "Upcoming" },
];

export default function SidebarMarketCards() {
  return (
    <div className="mt-4 space-y-3">
      <h4 className="px-2 text-[11px] uppercase tracking-wide text-white/50">
        Upcoming & Ongoing
      </h4>

      {markets.map((m) => (
        <div
          key={m.title}
          className="
            relative mx-1 px-4 py-3 rounded-xl
            bg-gradient-to-r from-indigo-600/70 via-purple-600/70 to-violet-600/70
            text-white
            cursor-pointer
            hover:brightness-110 transition
          "
        >
          {/* ===== Ticket cut (top) ===== */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2
                       w-4 h-4 rounded-full"
            style={{ background: "#0b1220" }}
          />

          {/* ===== Ticket cut (bottom) ===== */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2
                       w-4 h-4 rounded-full"
            style={{ background: "#0b1220" }}
          />

          <div className="text-[11px] opacity-80">{m.date}</div>

          <div className="text-sm font-semibold leading-tight">
            {m.title}
          </div>

          <div className="mt-1 text-[10px] opacity-80">
            {m.status}
          </div>
        </div>
      ))}
    </div>
  );
}

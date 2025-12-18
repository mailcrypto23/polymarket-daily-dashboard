import SidebarMarketCards from "./SidebarMarketCards";

const categories = [
  { label: "Top Markets", icon: "🔥", count: 10 },
  { label: "High Probability", icon: "🎯", count: 8 },
  { label: "Trending", icon: "📈", count: 10 },
  { label: "New Markets", icon: "🆕", count: 6 },
  { label: "Crypto", icon: "₿", count: 10 },
  { label: "Politics", icon: "🏛️", count: 6 },
  { label: "Sports", icon: "🏆", count: 15 },
  { label: "Economy", icon: "🌍", count: 10 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-premiumDark border-r border-white/5 p-4">
      {/* Brand */}
      <div className="text-xl font-semibold mb-6">
        Polymarket <span className="opacity-60">Premium</span>
      </div>

      {/* Categories */}
      <nav className="space-y-1 mb-6">
        {categories.map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-between px-3 py-2
                       rounded-lg text-sm cursor-pointer
                       text-white/80 hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </div>
            <span className="text-[11px] text-white/40">
              {c.count} bets
            </span>
          </div>
        ))}
      </nav>

      {/* Upcoming / Ongoing */}
      <SidebarMarketCards />
    </aside>
  );
}

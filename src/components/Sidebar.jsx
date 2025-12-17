import SidebarMarketCards from "./SidebarMarketCards";

const categories = [
  { label: "Top Markets", icon: "🔥" },
  { label: "High Probability", icon: "🎯" },
  { label: "Trending", icon: "📈" },
  { label: "New Markets", icon: "🆕" },
  { label: "Crypto", icon: "₿" },
  { label: "Politics", icon: "🏛️" },
  { label: "Sports", icon: "🏆" },
  { label: "Economy", icon: "🌍" },
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg
                       text-sm text-white/80 hover:bg-white/5 cursor-pointer"
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </nav>

      {/* Upcoming markets */}
      <SidebarMarketCards />
    </aside>
  );
}

import SidebarMarketCards from "./SidebarMarketCards";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-premiumDark border-r border-white/5 p-4 flex flex-col">
      {/* ================= BRAND ================= */}
      <div className="text-xl font-semibold mb-6">
        Polymarket <span className="opacity-60">Premium</span>
      </div>

      {/* ================= MAIN NAV ================= */}
      <nav className="space-y-2 text-sm">
        <SidebarItem label="Dashboard" />
        <SidebarItem label="Market" />
        <SidebarItem label="Orderbook" />
        <SidebarItem label="Portfolio" />
        <SidebarItem label="AI Studio" />
      </nav>

      {/* ================= CATEGORY ACTIONS ================= */}
      <div className="mt-6 space-y-2 text-sm">
        <SidebarItem label="Top Markets" icon="🔥" />
        <SidebarItem label="High Probability" icon="🎯" />
        <SidebarItem label="Trending" icon="📈" />
        <SidebarItem label="New Markets" icon="🆕" />
        <SidebarItem label="Crypto" icon="₿" />
        <SidebarItem label="Politics" icon="🏛️" />
        <SidebarItem label="Sports" icon="🏆" />
        <SidebarItem label="Economy" icon="🌍" />
      </div>

      {/* ================= UPCOMING / ONGOING ================= */}
      <SidebarMarketCards />
    </aside>
  );
}

/* ---------- Small helper component ---------- */
function SidebarItem({ label, icon }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                    hover:bg-white/5 transition">
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
}

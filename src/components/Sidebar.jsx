import SidebarMarketCards from "./SidebarMarketCards";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-premiumDark border-r border-white/5 p-4">
      {/* ================= BRAND ================= */}
      <div className="text-xl font-semibold mb-6">
        Polymarket <span className="opacity-60">Premium</span>
      </div>

      {/* ================= UPCOMING / ONGOING ONLY ================= */}
      <SidebarMarketCards />
    </aside>
  );
}

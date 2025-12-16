export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#071127] p-4 hidden md:block">
      <h2 className="font-bold mb-6">Polymarket Premium</h2>
      <nav className="space-y-2 text-sm">
        {["Dashboard", "Market", "Orderbook", "Portfolio", "AI Studio"].map(
          (i) => (
            <div
              key={i}
              className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer"
            >
              {i}
            </div>
          )
        )}
      </nav>
    </aside>
  );
}

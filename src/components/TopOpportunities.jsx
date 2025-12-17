const bets = [
  { title: "Time Person of the Year — AI", chance: 96, vol: "$53M" },
  { title: "Fed rate cut in January", chance: 73, vol: "$36M" },
  { title: "Trump nominee confirmed", chance: 70, vol: "$18M" },
  { title: "Netflix acquisition closes", chance: 81, vol: "$12M" },
  { title: "Ukraine ceasefire in 2025", chance: 68, vol: "$22M" },
];

export default function TopOpportunities() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        🔥 High-Confidence Opportunities
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bets.map((b) => (
          <div
            key={b.title}
            className="
              relative rounded-2xl p-5 text-white
              bg-gradient-to-r from-indigo-600/80 via-purple-600/80 to-violet-600/80
              hover:brightness-110 transition
            "
          >
            {/* ===== Ticket cut (top) ===== */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2
                         w-6 h-6 rounded-full"
              style={{ background: "#0b1220" }}
            />

            {/* ===== Ticket cut (bottom) ===== */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2
                         w-6 h-6 rounded-full"
              style={{ background: "#0b1220" }}
            />

            {/* Title */}
            <div className="text-sm font-medium leading-snug mb-3">
              {b.title}
            </div>

            {/* Probability */}
            <div className="text-3xl font-bold text-green-300">
              {b.chance}%
            </div>

            {/* Volume */}
            <div className="text-xs opacity-80 mb-4">
              Volume {b.vol}
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 rounded-full text-sm font-semibold
                           bg-white/15 hover:bg-white/25 transition"
              >
                YES
              </button>

              <button
                className="flex-1 py-2 rounded-full text-sm font-semibold
                           bg-black/20 hover:bg-black/30 transition"
              >
                NO
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const actions = [
  { label: "Top Markets", icon: "🔥" },
  { label: "High Probability", icon: "🎯" },
  { label: "Trending", icon: "📈" },
  { label: "New Markets", icon: "🆕" },
  { label: "Crypto", icon: "₿" },
  { label: "Politics", icon: "🏛️" },
  { label: "Sports", icon: "🏆" },
  { label: "Economy", icon: "🌍" },
];

export default function QuickActions() {
  return (
    <section className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {actions.map((a) => (
        <div
          key={a.label}
          className="bg-premiumCard rounded-xl p-4 flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer"
        >
          <div className="text-2xl mb-1">{a.icon}</div>
          <div className="text-xs font-medium">{a.label}</div>
        </div>
      ))}
    </section>
  );
}

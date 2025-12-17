const stats = [
  { label: "Earnings", value: "$234" },
  { label: "Active Bets", value: "3" },
  { label: "Win Rate", value: "92%" },
];

export default function SlidingStats() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="min-w-[160px] bg-premiumCard p-3 rounded-lg"
        >
          <div className="text-sm opacity-70">{s.label}</div>
          <div className="text-xl font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

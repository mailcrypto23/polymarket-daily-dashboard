import CandlesChart from "../charts/CandlesChart";

export default function ChartCard({ title = "Price Chart", pair }) {
  return (
    <div className="bg-premiumCard rounded-xl p-4 h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs opacity-70">{pair}</span>
      </div>

      <div className="h-[260px]">
        <CandlesChart />
      </div>
    </div>
  );
}

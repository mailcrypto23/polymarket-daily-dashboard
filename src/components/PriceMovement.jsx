import LinePriceChart from "./charts/LinePriceChart";

export default function PriceMovement() {
  return (
    <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/40 p-4">
      <LinePriceChart />
    </div>
  );
}

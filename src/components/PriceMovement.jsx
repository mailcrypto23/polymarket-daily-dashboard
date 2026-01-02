import LinePriceChart from "../charts/LinePriceChart";

export default function PriceMovement() {
  return (
    <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
      <LinePriceChart />
    </div>
  );
}

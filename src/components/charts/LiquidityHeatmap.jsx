export default function LiquidityHeatmap() {
  return (
    <div className="grid grid-cols-10 gap-1 h-56">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="rounded bg-indigo-500/20"
          style={{ opacity: Math.random() }}
        />
      ))}
    </div>
  );
}



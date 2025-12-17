import React, { useEffect, useState } from "react";

const genHeat = () =>
  Array.from({ length: 6 }).map(() =>
    Array.from({ length: 12 }).map(() => Math.random())
  );

export default function LiquidityHeatmap() {
  const [grid, setGrid] = useState(genHeat());

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(genHeat());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-rows-6 gap-2">
      {grid.map((row, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          {row.map((v, j) => (
            <div
              key={j}
              className="h-4 rounded"
              style={{
                background: `rgba(139,92,246,${v})`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

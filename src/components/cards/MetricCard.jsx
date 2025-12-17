import React from "react";

export default function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#0b1220] to-[#111a2e] border border-white/5 p-5 shadow-lg">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-white">
        {value}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
      )}
    </div>
  );
}


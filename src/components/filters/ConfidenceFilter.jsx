export default function ConfidenceFilter({ value, onChange }) {
  const levels = [55, 60, 65, 70, 75];

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="opacity-70">Min Confidence</span>
      {levels.map(level => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-3 py-1 rounded-full transition ${
            value === level
              ? "bg-violet-600 text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {level}%
        </button>
      ))}
    </div>
  );
}

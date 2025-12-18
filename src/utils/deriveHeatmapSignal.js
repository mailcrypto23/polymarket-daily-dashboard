export function deriveHeatmapSignal(data) {
  let yes = 0;
  let no = 0;
  let whales = 0;

  data.flat().forEach(cell => {
    if (cell.side === "YES") yes += cell.intensity;
    else no += cell.intensity;

    if (cell.intensity > 0.85) whales++;
  });

  const dominance = yes > no ? "YES" : "NO";
  const ratio = Math.max(yes, no) / Math.max(1, Math.min(yes, no));
  const confidence = Math.min(98, Math.round(ratio * 30 + 40));

  return {
    dominance,
    confidence,
    whales,
    yesStrength: yes.toFixed(2),
    noStrength: no.toFixed(2),
  };
}

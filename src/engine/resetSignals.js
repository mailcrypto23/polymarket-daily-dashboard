// DEV ONLY — resets all local analytics state

export function resetSignals() {
  localStorage.removeItem("pm_signal_history");
  localStorage.removeItem("pm_engine_meta");
  console.info("[engine] local signals reset");
}

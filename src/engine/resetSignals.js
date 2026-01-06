export function resetAllSignals() {
  localStorage.removeItem("pm_signal_history");
  localStorage.removeItem("pm_signal_log");
  console.log("All local signals cleared");
}

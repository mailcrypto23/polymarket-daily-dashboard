export function logSignal(signal) {
  const key = "pm_signal_log";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  existing.push({
    ...signal,
    loggedAt: new Date().toISOString()
  });

  localStorage.setItem(key, JSON.stringify(existing));
}

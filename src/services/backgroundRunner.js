import { runSignalAutoResolver } from "../engine/signalAutoResolver";

export function startBackgroundRunner() {
  if (typeof window === "undefined") return;

  setInterval(() => {
    runSignalAutoResolver();
  }, 2000);
}

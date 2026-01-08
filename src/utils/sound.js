export function playSignalSound() {
  try {
    const audio = new Audio("/sounds/notify.mp3");
    audio.volume = 0.4;
    audio.play();
  } catch {
    // Silent fail (browser policies)
  }
}

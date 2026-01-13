import { getActive15mSignals } from "../engine/Crypto15mSignalEngine";

export default function EngineDebugOverlay() {
  const signals = getActive15mSignals();

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-auto bg-black/90 text-green-400 text-xs rounded-lg p-3 border border-green-500 z-[9999]">
      <div className="font-bold mb-2">ENGINE DEBUG</div>

      {Object.values(signals).map(s => (
        <div key={s.id} className="mb-2 border-b border-green-800 pb-1">
          <div>{s.symbol} · {s.direction}</div>
          <div>conf: {(s.confidence * 100).toFixed(1)}%</div>
          <div>edge: {s.edge ?? "—"}</div>
          <div>action: {s.userAction ?? "NONE"}</div>
          <div>entryOpen: {String(s.entryOpen)}</div>
        </div>
      ))}
    </div>
  );
}

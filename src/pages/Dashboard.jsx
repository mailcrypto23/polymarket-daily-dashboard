import React, { useEffect, useMemo, useState } from "react";

/*
  Polymarket — Hybrid Premium Dashboard (Option 3)
  - Reads mock-data from ../mock-data/*.json (safe fallback)
  - Tailwind utility classes assumed available in project
  - Self-contained small helpers (sparkline, format)
*/

// safe JSON loader: dynamic import with fallback
async function loadJson(path) {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module.default ?? module;
  } catch (e) {
    // swallow errors, return null to allow fallback
    return null;
  }
}

function fmtPrice(n) {
  if (n == null) return "--";
  const v = Number(n);
  if (isNaN(v)) return n;
  return v >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : v.toFixed(2);
}
function fmtChange(pct) {
  if (pct == null) return "--";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${Number(pct).toFixed(2)}%`;
}

// small sparkline path generator from an array of numbers
function Sparkline({ data = [], width = 120, height = 34, stroke = "currentColor" }) {
  const d = useMemo(() => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / Math.max(1, data.length - 1);
    return data
      .map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / range) * height;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data, width, height]);

  if (!d) return <div className="w-[120px] h-[34px]" />;

  return (
    <svg width={width} height={height} className="inline-block" viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    </svg>
  );
}

function KPIBlock({ title, value, hint }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function MarketCard({ market }) {
  const price = market?.price ?? market?.last ?? null;
  const change = market?.change24h ?? market?.change ?? 0;
  // small sparkline values: try candles series if present or fallback to ticks
  const ticks = market?.sparkline || market?.candles || market?.series || [];
  const positive = Number(change) >= 0;
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-slate-300">{market?.symbol || market?.pair || market?.name}</div>
          <div className="text-lg font-bold text-white mt-1">{fmtPrice(price)}</div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>{fmtChange(change)}</div>
          <div className="text-xs text-slate-400 mt-1">{market?.marketCap ? `MC ${Math.round(market.marketCap)}` : ""}</div>
        </div>
      </div>
      <div className="mt-3">
        <Sparkline data={ticks} width={220} height={40} stroke={positive ? "#22c55e" : "#fb7185"} />
      </div>
    </div>
  );
}

function OrderbookPreview({ orderbook }) {
  const bids = (orderbook?.bids || []).slice(0, 6);
  const asks = (orderbook?.asks || []).slice(0, 6);
  const bestBid = bids[0]?.[0] ?? "--";
  const bestAsk = asks[0]?.[0] ?? "--";
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Orderbook</div>
          <div className="text-sm text-slate-200 font-semibold">Bids / Asks</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-300">Best bid</div>
          <div className="text-lg font-semibold text-emerald-400">{fmtPrice(bestBid)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-300">Best ask</div>
          <div className="text-lg font-semibold text-rose-400">{fmtPrice(bestAsk)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div>
          <div className="text-xs text-slate-400">Bids</div>
          <div className="mt-2 space-y-1">
            {bids.map((b, i) => (
              <div key={i} className="flex justify-between text-slate-200">
                <div>{fmtPrice(b[0])}</div>
                <div className="text-slate-400">{b[1]}</div>
              </div>
            ))}
            {bids.length === 0 && <div className="text-slate-500">No bids</div>}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Asks</div>
          <div className="mt-2 space-y-1">
            {asks.map((a, i) => (
              <div key={i} className="flex justify-between text-slate-200">
                <div>{fmtPrice(a[0])}</div>
                <div className="text-slate-400">{a[1]}</div>
              </div>
            ))}
            {asks.length === 0 && <div className="text-slate-500">No asks</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ portfolio }) {
  const total = (portfolio?.positions || []).reduce((s, p) => s + (Number(p.value) || 0), 0);
  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
      <div className="text-xs text-slate-400">Portfolio</div>
      <div className="text-xl font-bold text-white mt-1">${fmtPrice(total)}</div>
      <div className="mt-3 space-y-2">
        {(portfolio?.positions || []).slice(0, 5).map((pos, i) => (
          <div key={i} className="flex items-center justify-between text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-xs">{(pos.symbol || pos.asset || "").slice(0, 2)}</div>
              <div>
                <div className="font-medium">{pos.symbol || pos.asset}</div>
                <div className="text-xs text-slate-400">{pos.amount} • ${fmtPrice(pos.value)}</div>
              </div>
            </div>
            <div className={`text-sm ${Number(pos.change) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{fmtChange(pos.change)}</div>
          </div>
        ))}
        {(portfolio?.positions || []).length === 0 && <div className="text-slate-500">No positions</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [orderbook, setOrderbook] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [candles, setCandles] = useState({});
  const [loading, setLoading] = useState(true);

  // load mock-data with dynamic imports; using relative Vite paths
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      // try to load existing mock files; adjust paths if your setup differs
      const [m, ob, pf, c] = await Promise.all([
        loadJson("../mock-data/markets.json"),
        loadJson("../mock-data/orderbook.json"),
        loadJson("../mock-data/portfolio.json"),
        loadJson("../mock-data/candles.json"),
      ]);
      if (!mounted) return;
      setMarkets(m ?? []);
      setOrderbook(ob ?? {});
      setPortfolio(pf ?? {});
      setCandles(c ?? {});
      setLoading(false);
    }
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const topMarkets = useMemo(() => (markets && markets.length ? markets.slice(0, 6) : []), [markets]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-900 text-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-sky-500 rounded-full flex items-center justify-center font-bold text-white">PM</div>
            <div>
              <div className="text-xs text-slate-400">Polymarket — Premium</div>
              <div className="text-lg font-semibold text-white">Dashboard</div>
            </div>
            <div className="ml-6 px-3 py-1 rounded-md bg-slate-800/40 text-xs text-slate-300 border border-slate-700">Polymarket hybrid theme</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Live</div>
            <div className="px-3 py-1 rounded bg-emerald-600/10 text-emerald-300 border border-emerald-600">ETH/USDT — —</div>
            <div className="text-xs text-slate-400">acct: 0x...ABCD</div>
          </div>
        </header>

        {/* KPI grid */}
        <section className="grid grid-cols-3 gap-4 mb-6">
          <KPIBlock title="Earnings" value={234} hint="Today" />
          <KPIBlock title="Expenses" value={0} hint="Today" />
          <KPIBlock title="Net" value={136} hint="Today" />
        </section>

        {/* main grid */}
        <main className="grid grid-cols-3 gap-4">
          {/* Left: Markets list */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Markets (sample)</h2>
              <div className="text-sm text-slate-400">Mock data demo</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {loading && <div className="col-span-3 text-slate-400">Loading mock markets...</div>}
              {!loading && topMarkets.length === 0 && <div className="col-span-3 text-slate-500">No market mock-data found.</div>}
              {!loading &&
                topMarkets.map((m, i) => (
                  <div key={i}>
                    <MarketCard market={{
                      symbol: m.symbol || m.pair || m.name,
                      name: m.name,
                      price: m.price || m.last,
                      change24h: m.change24h || m.change,
                      sparkline: (m.sparkline && m.sparkline.slice ? m.sparkline : (candles?.[m.symbol] || m.series || [])).slice?.call ? (m.sparkline || candles?.[m.symbol] || []) : []
                    }} />
                  </div>
                ))}
            </div>

            {/* Markets table or extended */}
            <div className="mt-3 bg-slate-800/20 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-slate-300">Market table (top 12)</div>
                <div className="text-sm text-slate-400">Mock-only</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left">
                      <th className="pb-2">Pair</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">24h</th>
                      <th className="pb-2">Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets && markets.slice(0, 12).map((r, idx) => (
                      <tr key={idx} className="border-t border-slate-700">
                        <td className="py-2">{r.pair || r.symbol || r.name}</td>
                        <td className="py-2 font-medium">${fmtPrice(r.price ?? r.last)}</td>
                        <td className={`py-2 ${Number(r.change24h ?? r.change) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{fmtChange(r.change24h ?? r.change)}</td>
                        <td className="py-2 text-slate-400">{r.volume24h ? Number(r.volume24h).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                    {(!markets || markets.length === 0) && <tr><td className="py-4 text-slate-500">No market data</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: Orderbook + portfolio */}
          <aside className="space-y-4">
            <OrderbookPreview orderbook={orderbook} />
            <PortfolioCard portfolio={portfolio} />
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-300">Notes</div>
              <div className="text-xs text-slate-400 mt-2">This demo uses local mock-data only — no live API keys are used. Replace with Polymarket API when access is granted.</div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import NeonPriceTicker from '../components/NeonPriceTicker'; // keep if you have it
import { fetchMarkets } from '../services/markets';
import './dashboard.css'; // optional, keep your styles

function MarketCard({ m }) {
  // m: { id, symbol, name, price, change24h, volume24h, marketCap }
  return (
    <div className="market-card" style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontSize:12, opacity:.8}}>{m.name}</div>
          <div style={{fontSize:18, fontWeight:700}}>{m.symbol} — ${Number(m.price).toLocaleString()}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{color: m.change24h >= 0 ? '#6ee7b7' : '#fb7185'}}>{m.change24h?.toFixed?.(2) ?? '0'}%</div>
          <div style={{fontSize:12, opacity:.7}}>${Number(m.volume24h || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchMarkets();
        if (!mounted) return;
        // data shape may be array or object; normalise to array
        const list = Array.isArray(data) ? data : (data.markets || data.items || []);
        setMarkets(list);
      } catch (err) {
        console.error('fetchMarkets error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <NeonPriceTicker />
      </div>

      <h2 style={{ marginTop: 16 }}>Dashboard — Premium</h2>

      <div style={{
        display:'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginTop: '12px'
      }}>
        <div className="premium-card">
          <div className="premium-metric">
            <div className="label">Today</div>
            <div className="value">234</div>
          </div>
        </div>
        <div className="premium-card">
          <div className="premium-metric">
            <div className="label">Today</div>
            <div className="value">0</div>
          </div>
        </div>
        <div className="premium-card">
          <div className="premium-metric">
            <div className="label">Today</div>
            <div className="value">136</div>
          </div>
        </div>
      </div>

      <section style={{ marginTop: 18 }}>
        <h3>Markets (sample)</h3>

        {loading && <div style={{ marginTop: 12 }}>Loading markets…</div>}

        {!loading && markets.length === 0 && (
          <div style={{ marginTop: 12, opacity: 0.8 }}>No market data found — check <code>src/mock-data/markets.json</code> or <code>src/services/markets.js</code>.</div>
        )}

        <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap:12, marginTop:12 }}>
          {markets.map((m) => <MarketCard key={m.id || m.symbol} m={m} />)}
        </div>
      </section>
    </div>
  );
}

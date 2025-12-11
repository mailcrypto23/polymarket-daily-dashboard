// File: src/pages/Dashboard.jsx
import React, {useEffect, useState} from 'react';
import Sidebar from '../components/Sidebar';
import NeonPriceTicker from '../components/NeonPriceTicker';
import PremiumCard from '../components/PremiumCard';
import MarketsTable from './Market';
import OrderbookPage from './Orderbook';
import mockMarkets from '../mock-data/markets.json';

export default function Dashboard(){
  const [markets, setMarkets] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{
    // try API hook then fallback to mock -- keep simple for presentation
    (async ()=>{
      try{
        // If src/services/markets.js exists it will use API; otherwise mock
        const mod = await import('../services/markets.js').catch(()=>null);
        if(mod && mod.fetchMarkets){
          const data = await mod.fetchMarkets();
          setMarkets(data || mockMarkets);
          setSelected((data||mockMarkets)[0]);
          return;
        }
      }catch(e){ /* ignore */ }
      setMarkets(mockMarkets);
      setSelected(mockMarkets[0]);
    })();
  },[]);

  return (
    <div className="min-h-screen flex bg-premiumDark text-premiumText">
      <Sidebar />
      <main className="flex-1 p-6 max-w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Polymarket — Premium</h1>
            <div className="mt-1 text-sm opacity-80">Polymarket hybrid theme · Mock demo</div>
          </div>
          <NeonPriceTicker pair={selected?.pair || 'ETH/USDT'} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PremiumCard title="Earnings" value="234" subtitle="Today" />
          <PremiumCard title="Expenses" value="0" subtitle="Today" />
          <PremiumCard title="Net" value="136" subtitle="Today" />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3">Markets (sample)</h2>
          <div className="bg-premiumCard rounded-lg p-4">
            <MarketsTable markets={markets} onSelect={(m)=>setSelected(m)} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-premiumCard rounded-lg p-4">
            <h3 className="mb-4 font-semibold">Orderbook (live-style)</h3>
            <OrderbookPage market={selected} />
          </div>

          <div className="bg-premiumCard rounded-lg p-4">
            <h3 className="mb-4 font-semibold">Portfolio (mock)</h3>
            <div className="text-sm opacity-80">Total value</div>
            <div className="text-2xl font-bold mt-2">$0.00</div>
            <div className="mt-4 text-sm opacity-70">No positions — mock-only demo. Replace with Polymarket API when available.</div>
          </div>
        </section>

      </main>
    </div>
  );
}


// File: src/pages/Market.jsx
import React from 'react';

export default function MarketsTable({markets=[], onSelect=()=>{}}){
  if(!markets || markets.length===0) return (
    <div className="p-6 text-center text-sm opacity-80">No market mock-data found.</div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs text-gray-300 border-b border-gray-700">
            <th className="py-2">Pair</th>
            <th>Price</th>
            <th>24h Vol</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {markets.slice(0,12).map(m=> (
            <tr key={m.id} className="hover:bg-[#0e1726] cursor-pointer" onClick={()=>onSelect(m)}>
              <td className="py-3">
                <div className="font-medium">{m.pair}</div>
                <div className="text-xs opacity-70">{m.market}</div>
              </td>
              <td className="py-3">{m.price}</td>
              <td className="py-3">{m.volume24h}</td>
              <td className="py-3 text-right"><button className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// File: src/pages/Orderbook.jsx
import React from 'react';

function OrderbookList({entries=[], type}){
  if(!entries || entries.length===0) return <div className="text-sm opacity-70">No {type.toLowerCase()}</div>;
  return (
    <div className="space-y-2 text-sm">
      {entries.slice(0,8).map((e,i)=> (
        <div key={i} className="flex justify-between">
          <div>{e.price}</div>
          <div className="opacity-75">{e.size}</div>
        </div>
      ))}
    </div>
  );
}

export default function OrderbookPage({market}){
  // mock bids/asks
  const bids = market?.orderbook?.bids || [];
  const asks = market?.orderbook?.asks || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs opacity-70 mb-2">Bids / Best bid</div>
        <OrderbookList entries={bids} type="Bids" />
      </div>
      <div>
        <div className="text-xs opacity-70 mb-2">Asks / Best ask</div>
        <OrderbookList entries={asks} type="Asks" />
      </div>
    </div>
  );
}


// File: src/components/PremiumCard.jsx
import React from 'react';
export default function PremiumCard({title,value,subtitle}){
  return (
    <div className="bg-gradient-to-b from-[#0f1724] to-[#0b1220] border border-gray-800 p-4 rounded-lg shadow-sm">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {subtitle && <div className="text-xs opacity-60 mt-1">{subtitle}</div>}
    </div>
  );
}

// File: src/components/Sidebar.jsx
import React from 'react';
export default function Sidebar(){
  return (
    <aside className="w-64 bg-[#071127] p-4 hidden md:block">
      <div className="mb-6">
        <div className="text-white font-bold">Polymarket Premium</div>
        <div className="text-xs opacity-70">Glossy Hybrid Theme</div>
      </div>
      <nav className="space-y-2 text-sm opacity-90">
        <div className="px-3 py-2 rounded bg-[#081228]">Dashboard</div>
        <div className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer">Market</div>
        <div className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer">Orderbook</div>
        <div className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer">Portfolio</div>
        <div className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer">AI Studio</div>
        <div className="px-3 py-2 rounded hover:bg-[#081229] cursor-pointer">Settings</div>
      </nav>
    </aside>
  );
}

// File: src/components/NeonPriceTicker.jsx
import React from 'react';
export default function NeonPriceTicker({pair='ETH/USDT'}){
  return (
    <div className="inline-flex items-center space-x-3 bg-[#071427] px-4 py-2 rounded-full border border-gray-700">
      <div className="text-xs opacity-70">LIVE</div>
      <div className="font-medium">{pair}</div>
      <div className="text-sm opacity-60">— —</div>
    </div>
  );
}

// NOTE: This single-file bundle is for quick copy/paste. For a real repo, split components into separate files.

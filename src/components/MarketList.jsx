import React, { useEffect, useState } from 'react';
import { fetchMarkets } from '../services/api';

export default function MarketList() {
  const [markets, setMarkets] = useState([]);
  useEffect(()=>{ fetchMarkets().then(m=>setMarkets(m||[])); }, []);
  return (
    <div>
      <h3>Markets</h3>
      <ul>
        {markets.length ? markets.map((m,i)=>(<li key={i}>{m.name||m.id||'market-'+i}</li>))
         : <li className='small'>No markets (mock)</li>}
      </ul>
    </div>
  );
}

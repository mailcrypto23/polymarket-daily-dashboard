import React, { useEffect, useState } from 'react';
import { subscribeToPrice } from '../services/realtime';

export default function NeonPriceTicker({pair='ETH/USDT'}) {
  const [price, setPrice] = useState('--');
  useEffect(()=>{
    const unsub = subscribeToPrice(pair, tick => setPrice(tick.price));
    return unsub;
  },[pair]);
  return (
    <div style={{ padding:8, borderRadius:8, background:'linear-gradient(90deg, rgba(124,58,237,0.08), rgba(58,60,255,0.03))' }}>
      <div style={{ fontSize:12, opacity:0.8 }}>LIVE</div>
      <div style={{ fontWeight:700, fontSize:18 }}>{pair} — {price}</div>
    </div>
  );
}

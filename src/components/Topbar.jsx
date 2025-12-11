import React from 'react';
export default function Topbar(){
  return (
    <header style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'transparent' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight: 600 }}>Polymarket — Dashboard</div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div className='small'>Connected: <strong>0x...abcd</strong></div>
        </div>
      </div>
    </header>
  );
}

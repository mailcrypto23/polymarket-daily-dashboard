import React from 'react';

export default function PremiumTopbar(){
  return (
    <header style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'transparent' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <img src='/public/assets/premium/icons/premium-menu.svg' alt='logo' style={{ width:36, height:36, borderRadius:8 }} />
          <div style={{ fontWeight:700 }}>Polymarket — Premium</div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:12 }} className='small'>Account</div>
            <div style={{ fontWeight:700 }}>0x...ABCD</div>
          </div>
        </div>
      </div>
    </header>
  );
}

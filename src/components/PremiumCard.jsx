import React from 'react';
export default function PremiumCard({ title, children }) {
  return (
    <div className='glass-card' style={{ position:'relative', overflow:'hidden' }}>
      {title && <div style={{ marginBottom:8, fontWeight:700 }}>{title}</div>}
      <div>{children}</div>
      <div style={{ position:'absolute', right:8, bottom:8, opacity:0.06 }}>
        <img src='/public/assets/premium/neon-lines.png' style={{ width:120, height:40 }} alt=''/>
      </div>
    </div>
  );
}

import React from 'react';
export default function GlassButton({children, onClick}) {
  return (
    <button onClick={onClick} style={{
      padding:'8px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)',
      background:'transparent', color:'#eaf0ff', cursor:'pointer'
    }}>{children}</button>
  );
}

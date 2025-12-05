import React from 'react'
export default function Sidebar(){ return (
  <aside style={{width:72,background:'linear-gradient(180deg,#071018,#0a0f12)',padding:12}}>
    <div style={{height:40,marginBottom:20,background:'#0ea5a4',borderRadius:8}}></div>
    <nav style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{width:40,height:40,background:'#0f1720',borderRadius:8}} />
      <div style={{width:40,height:40,background:'#0f1720',borderRadius:8}} />
    </nav>
  </aside>
)}
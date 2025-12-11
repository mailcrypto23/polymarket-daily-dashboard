import React from 'react';
import { NavLink } from 'react-router-dom';

const item = (t, active) => ({ display:'block', padding:'10px 12px', borderRadius:10, margin:'8px 0',
  background: active ? 'linear-gradient(90deg, rgba(124,58,237,0.12), rgba(58,60,255,0.06))' : 'transparent',
  color: active ? '#fff' : 'rgba(255,255,255,0.8)' });

export default function GlossySidebar(){
  return (
    <aside style={{ width:260, padding:18, borderRight:'1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontWeight:800, fontSize:18 }}>Polymarket Premium</div>
        <div style={{ fontSize:12, opacity:0.85 }}>Glossy Banking Theme</div>
      </div>
      <nav>
        <NavLink to='/dashboard' children={({isActive})=>(<div style={item('Dashboard', isActive)}>Dashboard</div>)} />
        <NavLink to='/market' children={({isActive})=>(<div style={item('Market', isActive)}>Market</div>)} />
        <NavLink to='/orderbook' children={({isActive})=>(<div style={item('Orderbook', isActive)}>Orderbook</div>)} />
        <NavLink to='/portfolio' children={({isActive})=>(<div style={item('Portfolio', isActive)}>Portfolio</div>)} />
        <NavLink to='/ai' children={({isActive})=>(<div style={item('AI Studio', isActive)}>AI Studio</div>)} />
        <NavLink to='/settings' children={({isActive})=>(<div style={item('Settings', isActive)}>Settings</div>)} />
      </nav>
    </aside>
  );
}

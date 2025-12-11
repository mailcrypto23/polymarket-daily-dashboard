import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  display: 'block', padding: '10px 12px', borderRadius: 8, margin: '6px 0',
  background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent'
});

export default function Sidebar(){
  return (
    <aside style={{ width: 240, padding: 16, borderRight: '1px solid rgba(255,255,255,0.03)' }}>
      <h3>Polymarket</h3>
      <nav style={{ marginTop:12 }}>
        <NavLink to='/dashboard' style={linkStyle}>Dashboard</NavLink>
        <NavLink to='/market' style={linkStyle}>Market</NavLink>
        <NavLink to='/orderbook' style={linkStyle}>Orderbook</NavLink>
        <NavLink to='/portfolio' style={linkStyle}>Portfolio</NavLink>
        <NavLink to='/ai' style={linkStyle}>AI Studio</NavLink>
        <NavLink to='/settings' style={linkStyle}>Settings</NavLink>
      </nav>
    </aside>
  );
}

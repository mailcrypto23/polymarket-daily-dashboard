import React from 'react';
import { applyTheme } from '../styles/theme-engine';

export default function ThemeSwitcher() {
  function set(t) { applyTheme(t); }
  return (
    <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems:'center' }}>
      <button onClick={() => set('glossy-dark')}>Glossy Dark</button>
      <button onClick={() => set('modern-light')}>Modern Light</button>
    </div>
  );
}

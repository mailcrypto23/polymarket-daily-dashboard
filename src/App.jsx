import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import GlossySidebar from './components/GlossySidebar';
import PremiumTopbar from './components/PremiumTopbar';
import FloatingNotifications from './components/FloatingNotifications';
import ThemeSwitcher from './components/ThemeSwitcher';

import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import OrderbookPage from './pages/OrderbookPage';
import Portfolio from './pages/Portfolio';
import AIStudio from './pages/AIStudio';
import Settings from './pages/Settings';

import { applyTheme } from './styles/theme-engine';
applyTheme('premium-glossy');

export default function App() {
  return (
    <div className='app-root' style={{ display: 'flex', minHeight: '100vh' }}>
      <GlossySidebar />

      <div style={{ flex: 1 }}>
        <PremiumTopbar />

        <div style={{ padding: 20 }}>
          <ThemeSwitcher />

          <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/market' element={<Market />} />
            <Route path='/orderbook' element={<OrderbookPage />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/ai' element={<AIStudio />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </div>
      </div>

      <FloatingNotifications />
    </div>
  );
}

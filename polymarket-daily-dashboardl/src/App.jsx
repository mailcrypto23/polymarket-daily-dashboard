import React from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import MarketOverview from './components/MarketOverview.jsx'
import ActivitySummary from './components/ActivitySummary.jsx'
import CryptoPortfolio from './components/CryptoPortfolio.jsx'
import LivePrices from './components/LivePrices.jsx'
import ChatAI from './components/ChatAI.jsx'

export default function App(){
  return (
    <div className="app hybrid-theme">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="content">
          <div className="left-column">
            <MarketOverview />
            <ActivitySummary />
          </div>
          <div className="right-column">
            <CryptoPortfolio />
            <LivePrices />
            <ChatAI />
          </div>
        </div>
      </div>
    </div>
  )
}

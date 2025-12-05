import React from 'react'
import MetricCard from '../components/cards/MetricCard'
import MarketList from '../components/market/MarketList'
export default function Dashboard(){
  return (
    <div>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <MetricCard title='Open Interest' value='1,245' />
          <MetricCard title='Active Markets' value='3.4K' />
        </div>
        <div style={{width:320}}>
          <MetricCard title='My Portfolio' value='$34,010' />
        </div>
      </div>
      <div style={{marginTop:20}}>
        <h3>Market List (mock)</h3>
        <MarketList />
      </div>
    </div>
  )
}

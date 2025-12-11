import React from 'react';
import PremiumCard from '../components/PremiumCard';
import NeonPriceTicker from '../components/NeonPriceTicker';

export default function Dashboard() {
  return (
    <div>
      <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
        <NeonPriceTicker />
      </div>

      <h2 style={{ marginTop:'12px' }}>Dashboard — Premium</h2>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:'12px',
        marginTop:'12px'
      }}>
        <PremiumCard title='Earnings'>
          <div className='premium-metric'>
            <div className='label'>Today</div>
            <div className='value'>234</div>
          </div>
        </PremiumCard>

        <PremiumCard title='Expenses'>
          <div className='premium-metric'>
            <div className='label'>Today</div>
            <div className='value'>0</div>
          </div>
        </PremiumCard>

        <PremiumCard title='Net'>
          <div className='premium-metric'>
            <div className='label'>Today</div>
            <div className='value'>136</div>
          </div>
        </PremiumCard>
      </div>

      <section style={{ marginTop:'18px' }}>
        <h3>Markets (sample)</h3>
      </section>
    </div>
  );
}

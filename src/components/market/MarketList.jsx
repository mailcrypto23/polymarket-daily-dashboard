import React, {useEffect, useState} from 'react'
import api from '../../services/mock-api'
export default function MarketList(){
  const [markets,setMarkets] = useState([])
  useEffect(()=>{ api.getMarkets().then(setMarkets) },[])
  return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
    {markets.map(m=> <div key={m.id} style={{padding:12,background:'rgba(255,255,255,0.02)',borderRadius:8}}>
      <div style={{fontWeight:700}}>{m.name}</div>
      <div style={{color:'#9aa3ad'}}>{m.price}</div>
    </div>)}
  </div>
}

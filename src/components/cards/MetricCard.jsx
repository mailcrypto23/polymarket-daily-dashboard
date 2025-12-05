import React from 'react'
export default function MetricCard({title,value}){
  return <div style={{padding:16,background:'rgba(255,255,255,0.02)',borderRadius:10,marginBottom:12}}>
    <div style={{fontSize:12,color:'#9aa3ad'}}>{title}</div>
    <div style={{fontSize:20,fontWeight:700}}>{value}</div>
  </div>
}

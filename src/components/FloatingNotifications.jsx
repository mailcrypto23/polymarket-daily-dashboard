import React from 'react';
export default function FloatingNotifications(){
  return (
    <div style={{ position:'fixed', right:20, bottom:20, zIndex:60 }}>
      <div style={{ padding:12, background:'rgba(255,255,255,0.03)', borderRadius:10 }}>Welcome to Premium</div>
    </div>
  );
}

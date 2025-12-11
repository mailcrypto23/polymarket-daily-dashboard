import React from 'react';
export default function Card({ title, children }) {
  return (
    <div className='card'>
      {title && <h4 style={{ marginTop:0 }}>{title}</h4>}
      <div>{children}</div>
    </div>
  );
}

import React from 'react';

const Loader = ({ size = 40 }) => {
  const style = {
    width: size,
    height: size,
    border: `${Math.max(2, Math.floor(size/10))}px solid #e5e7eb`,
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  };
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={style} />
      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg);} }`}</style>
    </div>
  );
};

export default Loader;

import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="skeleton" style={{ width: '100%', height: '220px', borderRadius: 'var(--radius-md)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton" style={{ width: '90%', height: '20px' }} />
        <div className="skeleton" style={{ width: '60%', height: '16px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
        <div className="skeleton" style={{ width: '30%', height: '24px' }} />
        <div className="skeleton" style={{ width: '35%', height: '36px', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.5rem',
      width: '100%'
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

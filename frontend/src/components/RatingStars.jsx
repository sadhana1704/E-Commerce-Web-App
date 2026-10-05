import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count = null, size = 16, showNumber = true }) {
  const roundedRating = Math.round(rating * 10) / 10;
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = roundedRating >= star;
          const isHalf = !isFilled && roundedRating >= star - 0.5;

          return (
            <span key={star} style={{ display: 'inline-flex', position: 'relative' }}>
              <Star
                size={size}
                color={isFilled || isHalf ? '#f59e0b' : 'var(--text-muted)'}
                fill={isFilled ? '#f59e0b' : isHalf ? '#f59e0b' : 'transparent'}
                strokeWidth={1.5}
              />
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginLeft: '0.2rem' }}>
          {roundedRating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}

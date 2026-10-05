import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

export default function Filters({
  categories = [],
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onResetFilters,
  totalResults = 0
}) {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem' }}>
          <Filter size={18} color="var(--primary)" /> Filter & Sort
        </div>
        <button
          onClick={onResetFilters}
          className="btn btn-outline btn-sm"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          title="Reset all filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort Options */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Sort Products</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="form-select"
          style={{ cursor: 'pointer' }}
        >
          <option value="newest">✨ Newest Arrivals</option>
          <option value="price_asc">💵 Price: Low to High</option>
          <option value="price_desc">💎 Price: High to Low</option>
          <option value="rating_desc">⭐ Highest Customer Rating</option>
          <option value="name_asc">🔤 Name: A to Z</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Categories</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button
            onClick={() => onCategoryChange('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: selectedCategory === 'all' ? 'var(--primary-light)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--primary)' : 'var(--text-primary)',
              fontWeight: selectedCategory === 'all' ? '700' : '500',
              fontSize: '0.875rem',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check size={16} />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span>{cat.name}</span>
                <span className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Price Range ($)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="form-input"
            min="0"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="form-input"
            min="0"
            style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span>Show In-Stock Only</span>
        </label>
      </div>

      {/* Results counter */}
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
        Found <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
      </div>
    </div>
  );
}

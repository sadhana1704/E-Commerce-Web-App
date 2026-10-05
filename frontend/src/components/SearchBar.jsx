import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search for products by name or keyword..." }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(value);
      }}
      style={{ position: 'relative', width: '100%' }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.5rem' : '1rem',
          height: '48px',
          fontSize: '0.95rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-sm)'
        }}
      />
      <Search
        size={18}
        color="var(--text-muted)"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onSubmit) onSubmit('');
          }}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}

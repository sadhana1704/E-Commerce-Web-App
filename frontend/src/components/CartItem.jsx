import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const isMaxStock = quantity >= product.stock;
  const isLowStock = product.stock <= 5;

  return (
    <div
      className="card"
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        position: 'relative'
      }}
    >
      {/* Product Image */}
      <Link to={`/products/${product.id}`} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', flexShrink: 0 }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Link>

      {/* Info & Quantity controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
            {product.category}
          </span>
          {isLowStock && (
            <span style={{ fontSize: '0.75rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <AlertTriangle size={12} /> Only {product.stock} left in stock
            </span>
          )}
        </div>

        <Link
          to={`/products/${product.id}`}
          style={{
            fontSize: '0.95rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: '1.3'
          }}
          className="cart-product-title"
        >
          {product.name}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ${product.price.toFixed(2)} each
          </span>

          {/* Stepper controls */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              style={{ padding: '0.3rem 0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '700' }}>
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={isMaxStock}
              style={{
                padding: '0.3rem 0.55rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isMaxStock ? 0.4 : 1,
                cursor: isMaxStock ? 'not-allowed' : 'pointer'
              }}
              aria-label="Increase quantity"
              title={isMaxStock ? 'Max available stock reached' : 'Increase quantity'}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Item Total and Delete Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '0.75rem' }}>
        <button
          onClick={() => removeFromCart(product.id)}
          className="btn-icon"
          style={{ color: 'var(--danger)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
          title="Remove from cart"
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 size={16} />
        </button>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <style>{`
        .cart-product-title:hover {
          color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}

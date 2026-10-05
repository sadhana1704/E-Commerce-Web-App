import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cartItems, clearCart, subtotal, tax, shipping, total, totalItemCount, freeShippingThreshold } = useCart();
  const navigate = useNavigate();

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Looks like you haven't added anything to your cart yet. Discover our latest tech, apparel, and lifestyle arrivals!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            You have <strong>{totalItemCount}</strong> {totalItemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      {/* Free shipping progress bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', backgroundColor: 'var(--bg-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
          <span>
            {amountNeededForFreeShipping > 0 ? (
              <>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Shipping!</strong></>
            ) : (
              <strong style={{ color: 'var(--success)' }}>🎉 Congratulations! You have unlocked FREE Shipping!</strong>
            )}
          </span>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{progressToFreeShipping}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{
            width: `${progressToFreeShipping}%`,
            height: '100%',
            backgroundColor: progressToFreeShipping >= 100 ? 'var(--success)' : 'var(--primary)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Main Cart Grid (Items List on left, Summary on right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="cart-grid-layout">
        
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}

          <div style={{ paddingTop: '1rem' }}>
            <Link to="/products" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Estimated Tax (8%)</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="badge badge-success">Free</span>
                ) : (
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${shipping.toFixed(2)}</span>
                )}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1.5px dashed var(--border-subtle)',
              fontSize: '1.25rem',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)'
            }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--success)" /> Safe & Instant Demo Checkout Flow
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

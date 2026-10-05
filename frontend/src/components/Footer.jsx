import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        {/* Value Proposition Banners */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>Free Fast Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On all orders over $50.00</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>Secure Demo Checkout</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% Safe Simulated Payment</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--info-bg)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>30-Day Easy Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hassle-free money-back guarantee</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expert assistance anytime</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--primary), #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ShoppingBag size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800' }}>
                Aura<span style={{ color: 'var(--primary)' }}>Store</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              A premium, full-stack e-commerce web application built for an internship project with React, Vite, Flask, and SQLite.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-secondary">Flask REST API</span>
              <span className="badge badge-secondary">SQLite</span>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/products?category=Electronics" style={{ transition: 'color 0.2s' }} className="footer-link">
                Electronics & Tech
              </Link>
              <Link to="/products?category=Accessories" style={{ transition: 'color 0.2s' }} className="footer-link">
                Lifestyle Accessories
              </Link>
              <Link to="/products?category=Clothing" style={{ transition: 'color 0.2s' }} className="footer-link">
                Apparel & Clothing
              </Link>
              <Link to="/products?category=Home" style={{ transition: 'color 0.2s' }} className="footer-link">
                Home & Living
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/products" className="footer-link">Browse Catalog</Link>
              <Link to="/cart" className="footer-link">Shopping Cart</Link>
              <Link to="/orders" className="footer-link">Order History</Link>
              <Link to="/login" className="footer-link">Customer Login</Link>
            </div>
          </div>

          {/* Demo Credentials Box */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              ⚡ Demo Accounts
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div>
                <strong>Admin:</strong> <code style={{ backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>admin@ecommerce.com</code> / <code style={{ backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>admin123</code>
              </div>
              <div>
                <strong>User:</strong> <code style={{ backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>user@ecommerce.com</code> / <code style={{ backgroundColor: 'var(--bg-card)', padding: '2px 4px', borderRadius: '4px' }}>user123</code>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} AuraStore E-Commerce Project. Built for internship demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Crafted with <Heart size={14} color="var(--danger)" fill="var(--danger)" /> for Full-Stack Excellence
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--primary) !important;
          transform: translateX(2px);
        }
      `}</style>
    </footer>
  );
}

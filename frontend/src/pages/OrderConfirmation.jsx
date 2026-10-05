import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, MapPin, Calendar, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Trigger festive confetti blast on page mount
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas not supported
    }

    if (!order) {
      async function fetchOrder() {
        try {
          setLoading(true);
          const res = await api.orders.getById(id);
          if (res && res.order) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error('Failed to load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order confirmation details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
            We could not locate this order.
          </p>
          <Link to="/" className="btn btn-primary">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '800px' }}>
      
      {/* Confirmation Hero Card */}
      <div className="card" style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle size={40} />
        </div>

        <span className="badge badge-success" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
          Order Confirmed & Saved
        </span>

        <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '0.5rem' }}>
          Thank You For Your Order!
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
          Your simulated demo order has been successfully recorded in the SQLite database with Order ID <strong>#{order.id}</strong>.
        </p>

        <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <Calendar size={15} color="var(--primary)" /> Placed: {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}
          </span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            Status: <span className={`badge status-${order.status.toLowerCase()}`}>{order.status}</span>
          </span>
        </div>
      </div>

      {/* Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Shipping Destination */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '700', fontSize: '1.05rem' }}>
            <MapPin size={18} color="var(--primary)" /> Shipping Destination
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{order.shipping_name}</div>
            <div>{order.shipping_address}</div>
            <div>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              📧 {order.shipping_email} | 📞 {order.shipping_phone}
            </div>
          </div>
        </div>

        {/* Payment & Total summary */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '700', fontSize: '1.05rem' }}>
            <Package size={18} color="var(--primary)" /> Payment & Totals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Payment Mode</span>
              <span className="badge badge-info">Simulated Demo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Total</span>
              <span>${order.total_amount ? (order.total_amount / 1.08).toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (8%)</span>
              <span>${order.total_amount ? (order.total_amount - (order.total_amount / 1.08)).toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)', fontWeight: '800', fontSize: '1.15rem' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>${order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Items List */}
      {order.items && order.items.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>
            Items Ordered ({order.items.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {order.items.map((item) => (
              <div key={item.id || item.product_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.925rem' }}>{item.product_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Navigation Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/orders" className="btn btn-primary btn-lg">
          <Package size={18} /> View My Orders
        </Link>
        <Link to="/products" className="btn btn-secondary btn-lg">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}

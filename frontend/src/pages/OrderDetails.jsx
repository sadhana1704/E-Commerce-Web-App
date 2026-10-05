import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Calendar, CheckCircle2, Clock, Truck, Check } from 'lucide-react';
import { api } from '../services/api';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await api.orders.getById(id);
        if (res && res.order) {
          setOrder(res.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem' }}>
        <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 1.5rem' }}>{error}</p>
          <Link to="/orders" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem', maxWidth: '900px' }}>
      
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      {/* Header Info */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Order #{order.id}</h1>
              <span className={`badge status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              ${order.total_amount?.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Timeline Status Tracker (if not cancelled) */}
        {!isCancelled ? (
          <div style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', gap: '0.5rem' }}>
              
              {/* Progress Line */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '12%',
                right: '12%',
                height: '3px',
                backgroundColor: 'var(--border-strong)',
                zIndex: 1
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, textAlign: 'center' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? 'var(--primary)' : 'var(--bg-card)',
                      color: isPassed ? '#ffffff' : 'var(--text-muted)',
                      border: `2px solid ${isPassed ? 'var(--primary)' : 'var(--border-strong)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {isPassed ? <Check size={16} strokeWidth={3} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? '800' : '600',
                      color: isCurrent ? 'var(--primary)' : isPassed ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ paddingTop: '1.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
            This order has been cancelled.
          </div>
        )}
      </div>

      {/* Grid: Shipping & Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '2rem' }}>
        
        {/* Shipping Address */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            <MapPin size={18} color="var(--primary)" /> Shipping Address
          </div>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{order.shipping_name}</div>
            <div>{order.shipping_address}</div>
            <div>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
              📧 {order.shipping_email}<br />
              📞 {order.shipping_phone}
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            <Package size={18} color="var(--primary)" /> Payment Summary
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${order.total_amount ? (order.total_amount / 1.08).toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (8%)</span>
              <span>${order.total_amount ? (order.total_amount - (order.total_amount / 1.08)).toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span className="badge badge-success">Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)', fontWeight: '800', fontSize: '1.15rem' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>${order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Items List */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Items in this Order ({order.items ? order.items.length : 0})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items && order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} color="var(--text-muted)" />
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.product_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ${item.price.toFixed(2)} × {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: '800', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

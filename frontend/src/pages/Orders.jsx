import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await api.orders.getMyOrders();
        if (res && res.orders) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>My Orders</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>My Orders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Track and review your previous orders and delivery status.
          </p>
        </div>
        <Link to="/products" className="btn btn-outline btn-sm">
          Browse More Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShoppingBag size={30} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.5rem' }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
            When you purchase products, your order history and live shipping trackers will appear right here.
          </p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Order Card Top Bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '1.1rem' }}>
                    <Package size={20} color="var(--primary)" /> Order #{order.id}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    ${order.total_amount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items Snapshot Preview */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {order.items && order.items.slice(0, 3).map((item) => (
                    <div key={item.id || item.product_id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                      {item.product_image && (
                        <img src={item.product_image} alt="" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                      )}
                      <span style={{ fontWeight: '600' }}>{item.product_name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      +{order.items.length - 3} more items
                    </span>
                  )}
                </div>

                <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={15} /> View Order Details
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

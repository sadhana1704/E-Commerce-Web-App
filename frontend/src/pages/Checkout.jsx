import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, clearCart, subtotal, tax, shipping, total } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill user profile info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shipping_name: prev.shipping_name || user.name || '',
        shipping_email: prev.shipping_email || user.email || '',
      }));
    }
  }, [user]);

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.shipping_name.trim()) newErrors.shipping_name = 'Full Name is required';
    if (!formData.shipping_email.trim()) {
      newErrors.shipping_email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.shipping_email)) {
      newErrors.shipping_email = 'Please enter a valid email';
    }
    if (!formData.shipping_phone.trim()) newErrors.shipping_phone = 'Phone number is required';
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Street address is required';
    if (!formData.shipping_city.trim()) newErrors.shipping_city = 'City is required';
    if (!formData.shipping_state.trim()) newErrors.shipping_state = 'State / Province is required';
    if (!formData.shipping_pincode.trim()) newErrors.shipping_pincode = 'Pincode / Postal Code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in or create an account to place an order.', 'error');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (!validate()) {
      showToast('Please fill in all required shipping details.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        ...formData,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.orders.create(payload);

      if (res && res.order) {
        showToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${res.order.id}`, { state: { order: res.order } });
      } else {
        throw new Error('Could not place order');
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFillDemo = () => {
    setFormData({
      shipping_name: user ? user.name : 'Alex Morgan',
      shipping_email: user ? user.email : 'user@ecommerce.com',
      shipping_phone: '+1 (555) 432-8765',
      shipping_address: '742 Evergreen Terrace, Apt 4B',
      shipping_city: 'Springfield',
      shipping_state: 'Oregon',
      shipping_pincode: '97477',
    });
    setErrors({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Return to Cart
        </Link>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Checkout</h1>
          <button onClick={handleAutoFillDemo} className="btn btn-outline btn-sm" type="button">
            ⚡ Autofill Demo Address
          </button>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--warning-bg)', borderColor: 'var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} color="var(--warning)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                You are currently checking out as a guest. Please log in to associate this order with your account.
              </span>
            </div>
            <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn btn-primary btn-sm">
              Sign In Now
            </Link>
          </div>
        </div>
      )}

      {/* Main Checkout Form + Summary Layout */}
      <form onSubmit={handlePlaceOrder}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '2.5rem',
          alignItems: 'start'
        }} className="checkout-layout">
          
          {/* Shipping Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <MapPin size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Shipping Information</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className="form-input"
                  />
                  {errors.shipping_name && <div className="form-error">{errors.shipping_name}</div>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="shipping_email"
                    value={formData.shipping_email}
                    onChange={handleChange}
                    placeholder="e.g. alex@example.com"
                    className="form-input"
                  />
                  {errors.shipping_email && <div className="form-error">{errors.shipping_email}</div>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="shipping_phone"
                    value={formData.shipping_phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 432-8765"
                    className="form-input"
                  />
                  {errors.shipping_phone && <div className="form-error">{errors.shipping_phone}</div>}
                </div>

                {/* Street Address */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="form-input"
                  />
                  {errors.shipping_address && <div className="form-error">{errors.shipping_address}</div>}
                </div>

                {/* City */}
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    placeholder="e.g. Springfield"
                    className="form-input"
                  />
                  {errors.shipping_city && <div className="form-error">{errors.shipping_city}</div>}
                </div>

                {/* State */}
                <div className="form-group">
                  <label className="form-label">State / Province *</label>
                  <input
                    type="text"
                    name="shipping_state"
                    value={formData.shipping_state}
                    onChange={handleChange}
                    placeholder="e.g. Oregon"
                    className="form-input"
                  />
                  {errors.shipping_state && <div className="form-error">{errors.shipping_state}</div>}
                </div>

                {/* Pincode */}
                <div className="form-group">
                  <label className="form-label">Pincode / Postal Code *</label>
                  <input
                    type="text"
                    name="shipping_pincode"
                    value={formData.shipping_pincode}
                    onChange={handleChange}
                    placeholder="e.g. 97477"
                    className="form-input"
                  />
                  {errors.shipping_pincode && <div className="form-error">{errors.shipping_pincode}</div>}
                </div>

              </div>
            </div>

            {/* Payment Demo Mode Box */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CreditCard size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Payment Method</h2>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1.5px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Simulated Demo Checkout</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Safe sandbox order flow (no real credit card charged)</div>
                  </div>
                </div>
                <ShieldCheck size={24} color="var(--success)" />
              </div>
            </div>

          </div>

          {/* Order Review & Submit Sidebar */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Order Review
            </h2>

            {/* Items snippet list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.25rem' }}>
              {cartItems.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.product.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', flexShrink: 0 }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="badge badge-success">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1.5px dashed var(--border-subtle)',
                fontSize: '1.3rem',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)'
              }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Demo Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {submitting ? 'Processing Demo Order...' : 'Place Demo Order'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Lock size={14} /> Instant SQLite Order Record Generation
            </div>
          </div>

        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

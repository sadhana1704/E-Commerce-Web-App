import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, Eye, EyeOff, Shield, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await login(email, password);
      if (res.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemoUser = () => {
    setEmail('user@ecommerce.com');
    setPassword('user123');
    setError('');
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@ecommerce.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#ffffff',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your orders, cart, and account
          </p>
        </div>

        {/* Quick Demo Autofill Helper Pills */}
        <div style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            ⚡ Instant 1-Click Demo Login:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFillDemoUser}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.5rem' }}
            >
              <User size={13} /> Demo User
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.5rem', color: 'var(--primary)' }}
            >
              <Shield size={13} /> Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Email Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

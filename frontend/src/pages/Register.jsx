import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await register({ name, email, password, role: 'user' });
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Header */}
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join AuraStore to start shopping today
          </p>
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
          
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password (min 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}

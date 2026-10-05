import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShieldAlert size={56} color="var(--danger)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You do not have administrator permissions to access this page. Please log in with an administrator account.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={16} /> Return to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

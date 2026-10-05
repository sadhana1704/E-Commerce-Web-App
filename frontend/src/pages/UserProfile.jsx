import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Shield, Calendar, Package, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
      }
      if (!currentPassword) {
        showToast('Please enter your current password to set a new password', 'error');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = { name };
      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await updateProfile(payload);
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem', maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Manage your account profile, credentials, and preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Profile Card */}
        <div className="card" style={{ padding: '1.75rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: user?.role === 'admin' ? 'var(--primary)' : 'var(--accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
              <span className={`badge ${user?.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`} style={{ marginTop: '0.4rem' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Customer Account'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/orders" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Package size={16} /> View My Orders History
            </Link>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            Update Profile Information
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Email (Readonly) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                className="form-input"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Change Password (Optional)</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aura_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('aura_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.getMe();
      if (response && response.user) {
        setUser(response.user);
      } else {
        // Invalid session
        localStorage.removeItem('aura_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Session validation error:', err);
      localStorage.removeItem('aura_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('aura_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        return { success: true, user: res.user };
      }
      throw new Error('Invalid response structure from server');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.auth.register(userData);
      if (res.token && res.user) {
        localStorage.setItem('aura_token', res.token);
        setToken(res.token);
        setUser(res.user);
        showToast(`Account created successfully! Welcome, ${res.user.name}`, 'success');
        return { success: true, user: res.user };
      }
      throw new Error('Registration failed');
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('aura_token');
      setToken(null);
      setUser(null);
      showToast('You have been logged out.', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.auth.updateProfile(profileData);
      if (res.user) {
        setUser(res.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true, user: res.user };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

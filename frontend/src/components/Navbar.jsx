import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--primary-glow)',
            color: '#ffffff'
          }}>
            <ShoppingBag size={22} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Aura<span style={{ color: 'var(--primary)' }}>Store</span>
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          style={{ 
            display: 'none', 
            position: 'relative', 
            maxWidth: '380px', 
            width: '100%',
            alignItems: 'center'
          }}
          className="desktop-search"
        >
          <input
            type="text"
            placeholder="Search products, brands, essentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.875rem'
            }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} />
        </form>
        <style>{`@media (min-width: 840px) { .desktop-search { display: flex !important; } }`}</style>

        {/* Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: '600', fontSize: '0.925rem', color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-secondary)' }}>
            Home
          </Link>
          <Link to="/products" style={{ fontWeight: '600', fontSize: '0.925rem', color: location.pathname === '/products' ? 'var(--primary)' : 'var(--text-secondary)' }}>
            Shop Catalog
          </Link>
          {isAdmin && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', fontSize: '0.925rem', color: 'var(--primary)' }}>
              <LayoutDashboard size={16} /> Admin Portal
            </Link>
          )}
        </nav>
        <style>{`@media (min-width: 680px) { .desktop-nav { display: flex !important; } }`}</style>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            aria-label="Toggle dark/light theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)' }}
          >
            {isDark ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} />}
          </button>

          {/* Cart Icon Button with Live Counter Badge */}
          <Link 
            to="/cart" 
            className="btn-icon" 
            style={{ position: 'relative', width: '40px', height: '40px', borderRadius: 'var(--radius-full)' }}
            aria-label={`Shopping cart with ${totalItemCount} items`}
          >
            <ShoppingCart size={20} />
            {totalItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: '800',
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.2s ease-in-out'
              }}>
                {totalItemCount > 99 ? '99+' : totalItemCount}
              </span>
            )}
          </Link>

          {/* User Account / Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            {isAuthenticated ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.65rem 0.35rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                  aria-expanded={userDropdownOpen}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isAdmin ? 'var(--primary)' : 'var(--accent)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '700'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="user-name-text">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.6rem',
                    zIndex: 1010,
                    animation: 'fadeIn 0.15s ease'
                  }}>
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                      <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-secondary'}`} style={{ marginTop: '0.4rem' }}>
                        {isAdmin ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                      }}
                      className="dropdown-item"
                    >
                      <Package size={16} color="var(--text-secondary)" /> My Orders
                    </Link>

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                      }}
                      className="dropdown-item"
                    >
                      <User size={16} color="var(--text-secondary)" /> Account Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          marginTop: '0.25rem',
                        }}
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.4rem 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'var(--danger)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                      className="dropdown-item-danger"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ display: 'none' }} className="register-btn-desktop">
                  Register
                </Link>
                <style>{`@media (min-width: 500px) { .register-btn-desktop { display: inline-flex !important; } }`}</style>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon"
            style={{ display: 'inline-flex' }}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <style>{`@media (min-width: 680px) { .mobile-menu-toggle { display: none !important; } }`}</style>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Link to="/" style={{ fontWeight: '600', padding: '0.5rem 0', color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-primary)' }}>
              Home
            </Link>
            <Link to="/products" style={{ fontWeight: '600', padding: '0.5rem 0', color: location.pathname === '/products' ? 'var(--primary)' : 'var(--text-primary)' }}>
              Shop Catalog
            </Link>
            {isAdmin && (
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', padding: '0.5rem 0', color: 'var(--primary)' }}>
                <LayoutDashboard size={18} /> Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/orders" style={{ fontWeight: '600', padding: '0.5rem 0', color: 'var(--text-primary)' }}>
                  My Orders
                </Link>
                <Link to="/profile" style={{ fontWeight: '600', padding: '0.5rem 0', color: 'var(--text-primary)' }}>
                  Account Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', padding: '0.5rem 0', color: 'var(--danger)', textAlign: 'left' }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .dropdown-item:hover {
          background-color: var(--bg-tertiary);
        }
        .dropdown-item-danger:hover {
          background-color: var(--danger-bg);
        }
      `}</style>
    </header>
  );
}

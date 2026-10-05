import React, { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  RefreshCw, 
  Filter, 
  Layers, 
  CheckCircle, 
  Truck, 
  Clock 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ProductFormModal from './ProductFormModal';

export default function AdminDashboard() {
  const { showToast } = useToast();

  // Active Tab: 'products' | 'orders'
  const [activeTab, setActiveTab] = useState('products');

  // Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [productsLoading, setProductsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Delete product confirmation modal
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.admin.getStats();
      if (res) setStats(res);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const params = {};
      if (productSearch) params.search = productSearch;
      if (productCategory !== 'all') params.category = productCategory;
      const res = await api.products.getAll(params);
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load products list:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [productSearch, productCategory]);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const params = {};
      if (orderStatusFilter !== 'all') params.status = orderStatusFilter;
      if (orderSearch) params.search = orderSearch;
      const res = await api.admin.getAllOrders(params);
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load all orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter, orderSearch]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchProducts, fetchOrders]);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await api.admin.updateOrderStatus(orderId, newStatus);
      showToast(res.message || `Order #${orderId} status updated to ${newStatus}`, 'success');
      
      // Update local state and reload stats
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Product Deletion
  const confirmDeleteProduct = async () => {
    if (!deleteProductTarget) return;

    try {
      setDeleting(true);
      await api.products.delete(deleteProductTarget.id);
      showToast(`Product "${deleteProductTarget.name}" deleted successfully`, 'success');
      setDeleteProductTarget(null);
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Admin Dashboard</h1>
            <span className="badge badge-primary">Administrator Portal</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Manage catalog inventory, monitor customer orders, and review store performance.
          </p>
        </div>

        <button
          onClick={() => { fetchStats(); if (activeTab === 'products') fetchProducts(); else fetchOrders(); }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Refresh dashboard data"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Total Revenue */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              ${stats ? stats.total_revenue?.toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--info-bg)',
            color: 'var(--info)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShoppingCart size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {stats ? stats.total_orders : 0}
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Package size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Products
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {stats ? stats.total_products : 0}
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--warning-bg)',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registered Users
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {stats ? stats.total_users : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Section (if any) */}
      {stats && stats.low_stock_products && stats.low_stock_products.length > 0 && (
        <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2.5rem', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={22} color="var(--warning)" />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Low Stock Inventory Alert:</strong>{' '}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {stats.low_stock_count} {stats.low_stock_count === 1 ? 'item has' : 'items have'} 5 or fewer units remaining.
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {stats.low_stock_products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setModalOpen(true);
                  }}
                  className="badge badge-warning"
                  style={{ cursor: 'pointer', border: 'none' }}
                  title="Click to edit and restock"
                >
                  {p.name} ({p.stock} left) ✏️
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
            fontWeight: '700',
            fontSize: '1rem',
            borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          <Package size={18} /> Products Management ({stats ? stats.total_products : products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
            fontWeight: '700',
            fontSize: '1rem',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          <ShoppingCart size={18} /> Orders Management ({stats ? stats.total_orders : orders.length})
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PRODUCT MANAGEMENT
          ========================================================================= */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Action Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', height: '40px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="form-select"
                style={{ width: 'auto', height: '40px' }}
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          {/* Products Table Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Product</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Category</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Price</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Stock</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Rating</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading product inventory...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="admin-table-row">
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                              alt=""
                              style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span className="badge badge-secondary">{p.category}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>
                          ${p.price.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          {p.stock <= 0 ? (
                            <span className="badge badge-danger">Out of stock (0)</span>
                          ) : p.stock <= 5 ? (
                            <span className="badge badge-warning">Low ({p.stock})</span>
                          ) : (
                            <span className="badge badge-success">{p.stock} units</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          ⭐ {p.rating?.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setModalOpen(true);
                              }}
                              className="btn btn-outline btn-sm"
                              title="Edit product"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteProductTarget(p)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--danger)', borderColor: 'var(--border-subtle)' }}
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: ORDER MANAGEMENT
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', height: '40px' }}
                />
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto', height: '40px' }}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Order ID & Date</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Customer</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Destination</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Total</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Items</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: '700' }}>Live Status Updater</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No customer orders match your query.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="admin-table-row">
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>Order #{o.id}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ fontWeight: '600' }}>{o.shipping_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.shipping_email}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>
                          {o.shipping_city}, {o.shipping_state}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                          ${o.total_amount?.toFixed(2)}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem' }}>
                          {o.items ? `${o.items.length} items` : '1 item'}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <select
                            value={o.status}
                            disabled={updatingOrderId === o.id}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`form-select status-${o.status.toLowerCase()}`}
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.825rem',
                              fontWeight: '700',
                              borderRadius: 'var(--radius-full)',
                              cursor: 'pointer',
                              width: 'auto'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        product={selectedProduct}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSaved={() => {
          fetchProducts();
          fetchStats();
        }}
      />

      {/* Delete Product Confirmation Modal */}
      {deleteProductTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem' }}>Delete Product?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong>"{deleteProductTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteProductTarget(null)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-table-row:hover {
          background-color: var(--bg-tertiary);
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ProductFormModal({ product = null, isOpen, onClose, onSaved }) {
  const { showToast } = useToast();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    stock: '',
    rating: '4.8',
    image_url: '',
  });

  const [saving, setSaving] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Electronics',
        price: product.price !== undefined ? product.price.toString() : '',
        stock: product.stock !== undefined ? product.stock.toString() : '',
        rating: product.rating !== undefined ? product.rating.toString() : '4.5',
        image_url: product.image_url || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Electronics',
        price: '',
        stock: '10',
        rating: '4.8',
        image_url: '',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    const finalCategory = formData.category === 'Custom' ? customCategory.trim() : formData.category;
    if (!finalCategory) {
      showToast('Category is required', 'error');
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);
    const rating = parseFloat(formData.rating);

    if (isNaN(price) || price < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      showToast('Please enter a valid stock quantity', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: finalCategory,
      price,
      stock,
      rating: isNaN(rating) ? 4.5 : Math.min(5, Math.max(1, rating)),
      image_url: formData.image_url.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    };

    try {
      setSaving(true);
      if (isEditing) {
        await api.products.update(product.id, payload);
        showToast(`Product "${payload.name}" updated successfully!`, 'success');
      } else {
        await api.products.create(payload);
        showToast(`Product "${payload.name}" created successfully!`, 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="card" style={{
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
            {isEditing ? `Edit Product: ${product.name}` : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Product Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sony Wireless Headphones"
              className="form-input"
              required
            />
          </div>

          {/* Category & Price Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            
            {/* Category */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Custom">+ Custom Category</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="form-input"
                required
              />
            </div>

            {/* Rating */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Rating (1 to 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.8"
                className="form-input"
              />
            </div>

          </div>

          {formData.category === 'Custom' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Custom Category Name *</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter new category name"
                className="form-input"
                required
              />
            </div>
          )}

          {/* Image URL */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="form-input"
            />
          </div>

          {/* Live Image Preview */}
          {formData.image_url && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <img
                src={formData.image_url}
                alt="Preview"
                onError={(e) => { e.target.style.display = 'none'; }}
                style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image preview</span>
            </div>
          )}

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Product Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed product specifications, highlights, and dimensions..."
              className="form-textarea"
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

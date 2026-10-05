import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1);
        const res = await api.products.getById(id);
        if (res && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.related_products || []);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          <div className="skeleton" style={{ height: '420px', borderRadius: 'var(--radius-xl)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '30%', height: '24px' }} />
            <div className="skeleton" style={{ width: '80%', height: '36px' }} />
            <div className="skeleton" style={{ width: '40%', height: '20px' }} />
            <div className="skeleton" style={{ width: '50%', height: '32px' }} />
            <div className="skeleton" style={{ width: '100%', height: '120px' }} />
            <div className="skeleton" style={{ width: '60%', height: '48px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <Link to="/products" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const itemInCart = cartItems.find((i) => i.product.id === product.id);
  const cartQty = itemInCart ? itemInCart.quantity : 0;
  const maxCanAdd = Math.max(0, product.stock - cartQty);

  const handleAddToCart = () => {
    if (quantity > 0 && !isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (quantity > 0 && !isOutOfStock) {
      const added = addToCart(product, quantity);
      if (added) {
        navigate('/checkout');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Breadcrumbs / Back navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}
          className="back-link"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {/* Main Product Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3.5rem',
        alignItems: 'start',
        marginBottom: '5rem'
      }}>
        
        {/* Product Image Section */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{
              width: '100%',
              height: '460px',
              objectFit: 'cover'
            }}
          />

          {/* Floating Category Pill */}
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <span className="badge badge-secondary" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'var(--bg-glass)', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
              {product.category}
            </span>
          </div>

          {/* Floating Stock Pill */}
          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : isLowStock ? (
              <span className="badge badge-warning">Only {product.stock} units left!</span>
            ) : (
              <span className="badge badge-success">In Stock ({product.stock})</span>
            )}
          </div>
        </div>

        {/* Product Details Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Title & Rating */}
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <RatingStars rating={product.rating} count={142} size={18} />
            </div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Inclusive of local demo taxes
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Product Overview
            </h4>
            {product.description}
          </div>

          {/* Cart Quantity Selector and Actions */}
          {!isOutOfStock ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Quantity Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.925rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Quantity:</span>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center' }}
                    aria-label="Decrease"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ minWidth: '44px', textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center' }}
                    aria-label="Increase"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  ({product.stock} available)
                </span>
              </div>

              {cartQty > 0 && (
                <div style={{ fontSize: '0.85rem', color: 'var(--info)' }}>
                  ℹ️ You currently have <strong>{cartQty}</strong> in your cart.
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={maxCanAdd <= 0}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={maxCanAdd <= 0}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1, minWidth: '180px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#ffffff', border: 'none' }}
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger)', padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--danger)', fontWeight: '700', fontSize: '0.95rem' }}>
                This item is currently sold out and unavailable for order.
              </p>
            </div>
          )}

          {/* Guarantees List */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} color="var(--primary)" /> Fast Local Dispatch
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} color="var(--success)" /> Genuine Verified Product
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <RotateCcw size={18} color="var(--info)" /> 30-Day Easy Returns
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.75rem' }}>
            Similar Products in {product.category}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .back-link:hover {
          color: var(--primary) !important;
          transform: translateX(-2px);
        }
      `}</style>
    </div>
  );
}

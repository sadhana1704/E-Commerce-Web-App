import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  
  // Find current quantity in cart
  const itemInCart = cartItems.find((item) => item.product.id === product.id);
  const cartQty = itemInCart ? itemInCart.quantity : 0;
  const isMaxInCart = cartQty >= product.stock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isMaxInCart) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Product Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%', // 4:3 Aspect Ratio
        overflow: 'hidden',
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="product-card-img"
        />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span className="badge badge-secondary" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'var(--bg-glass)' }}>
            {product.category}
          </span>
        </div>

        {/* Stock Status Pill */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">Only {product.stock} left</span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Rating */}
        <div style={{ marginBottom: '0.4rem' }}>
          <RatingStars rating={product.rating} size={14} />
        </div>

        {/* Product Title */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: '700',
          marginBottom: '0.4rem',
          lineHeight: '1.35',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: 'var(--text-primary)'
        }}>
          {product.name}
        </h3>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {product.description}
        </p>

        {/* Price and Add to Cart Action */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxInCart}
            className={`btn ${isOutOfStock || isMaxInCart ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 0.85rem' }}
            title={
              isOutOfStock 
                ? "Out of stock" 
                : isMaxInCart 
                ? "Maximum stock already in cart" 
                : "Add to cart"
            }
          >
            {isOutOfStock ? (
              <span>Sold Out</span>
            ) : isMaxInCart ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={14} /> In Cart ({cartQty})
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShoppingCart size={15} /> Add
              </span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .card:hover .product-card-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Layers 
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.products.getAll({ limit: 8 }),
          api.products.getCategories(),
        ]);

        if (prodRes && prodRes.products) {
          // Select featured (high rating) and popular products
          setFeaturedProducts(prodRes.products.slice(0, 4));
          setPopularProducts(prodRes.products.slice(4, 8));
        }

        if (catRes && catRes.categories) {
          setCategories(catRes.categories);
        }
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const categoryImages = {
    'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'Clothing': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    'Home': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '4.5rem 0 5rem'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
              <span className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                <Sparkles size={14} /> New Season Arrivals 2026
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '800',
              lineHeight: '1.12',
              letterSpacing: '-0.03em'
            }}>
              Discover Premium Quality, Crafted for Modern Living.
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '540px'
            }}>
              Explore our curated selection of high-end electronics, luxury apparel, lifestyle accessories, and home aesthetics with instant local checkout.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Catalog <ArrowRight size={18} />
              </Link>
              <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
                Shop Electronics
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              marginTop: '0.5rem'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authentic Gear</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  2-Day
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Express Dispatch</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  4.9 / 5
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Graphic Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-strong)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Featured Premium Product"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                color: '#ffffff'
              }}>
                <span className="badge badge-warning" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>
                  🔥 Best Seller
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>
                  Sony WH-1000XM5 Wireless
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1rem' }}>
                  Next-generation noise cancelling with breathtaking acoustic clarity.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>$348.00</span>
                  <Link to="/products" className="btn btn-primary btn-sm" style={{ backgroundColor: '#ffffff', color: 'var(--text-primary)' }}>
                    View Deal
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Layers size={16} /> Explore Collections
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Shop by Category</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--primary)', fontSize: '0.925rem' }}>
            All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {['Electronics', 'Accessories', 'Clothing', 'Home'].map((catName) => {
            const catInfo = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
            const count = catInfo ? catInfo.count : 'Popular';
            const imgUrl = categoryImages[catName] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

            return (
              <Link
                key={catName}
                to={`/products?category=${encodeURIComponent(catName)}`}
                className="card card-hover"
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  padding: 0,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <img
                  src={imgUrl}
                  alt={catName}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  className="cat-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%)'
                }} />
                <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem', color: '#ffffff' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                    {typeof count === 'number' ? `${count} Items` : count}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
                    {catName}
                  </h3>
                </div>
                <style>{`
                  .card:hover .cat-img {
                    transform: scale(1.08);
                  }
                `}</style>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Flame size={16} color="var(--warning)" /> Top Highlights
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Featured Products</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--primary)', fontSize: '0.925rem' }}>
            View Full Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Modern Promotional Call-To-Action Banner */}
      <section className="container">
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)',
          color: '#ffffff',
          padding: '3.5rem 2.5rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <span className="badge badge-warning" style={{ marginBottom: '1rem' }}>
              ⚡ Limited Time Promo
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
              Upgrade Your Setup with Free Express Shipping.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Orders over $50 qualify for automatic complimentary priority shipping. Test out our seamless demo checkout experience today.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg" style={{ backgroundColor: '#ffffff', color: '#1e1b4b', fontWeight: '700' }}>
                Start Shopping Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular / Trending Products Section */}
      <section className="container" style={{ paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <TrendingUp size={16} /> Customer Favorites
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Trending This Week</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--primary)', fontSize: '0.925rem' }}>
            See All Items <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, PackageX, Search } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter params initialized from URL or defaults
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort_by') || 'newest';
  const inStockOnly = searchParams.get('in_stock') === 'true';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (value !== undefined && value !== null && value !== '' && value !== false && value !== 'all') {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
      return updated;
    });
  };

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.products.getCategories();
        if (res && res.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (sortBy) params.sort_by = sortBy;
      if (inStockOnly) params.in_stock = 'true';
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      const res = await api.products.getAll(params);
      if (res && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, inStockOnly, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = search || (category && category !== 'all') || inStockOnly || minPrice || maxPrice;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Page Title & Search Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '2.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Shop Catalog
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Explore our comprehensive range of high-quality goods.
            </p>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-secondary mobile-filter-btn"
            style={{ display: 'none', gap: '0.5rem' }}
          >
            <SlidersHorizontal size={18} /> Filters {hasActiveFilters && '(Active)'}
          </button>
          <style>{`@media (max-width: 860px) { .mobile-filter-btn { display: inline-flex !important; } }`}</style>
        </div>

        {/* Global Search Bar */}
        <div style={{ maxWidth: '680px' }}>
          <SearchBar
            value={search}
            onChange={(val) => updateParam('search', val)}
            placeholder="Search by product name, description, brand..."
          />
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', paddingTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Active Filters:</span>
            
            {search && (
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Search: "{search}"
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('search', '')} />
              </span>
            )}

            {category && category !== 'all' && (
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Category: {category}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('category', 'all')} />
              </span>
            )}

            {inStockOnly && (
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                In-Stock Only
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('in_stock', false)} />
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Price: ${minPrice || '0'} – ${maxPrice || '∞'}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => { updateParam('min_price', ''); updateParam('max_price', ''); }} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginLeft: '0.25rem' }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Layout (Sidebar + Product Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="catalog-layout">
        
        {/* Desktop Sidebar Filters */}
        <aside className="desktop-sidebar">
          <Filters
            categories={categories}
            selectedCategory={category}
            onCategoryChange={(cat) => updateParam('category', cat)}
            sortBy={sortBy}
            onSortChange={(sort) => updateParam('sort_by', sort)}
            inStockOnly={inStockOnly}
            onInStockChange={(val) => updateParam('in_stock', val)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(val) => updateParam('min_price', val)}
            onMaxPriceChange={(val) => updateParam('max_price', val)}
            onResetFilters={handleResetFilters}
            totalResults={products.length}
          />
        </aside>

        {/* Product Grid Area */}
        <main>
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <PackageX size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
                We couldn't find any products matching your current filters. Try changing keywords or resetting filter parameters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '340px',
            height: '100%',
            backgroundColor: 'var(--bg-secondary)',
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Filters & Sort</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="btn-icon" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <Filters
              categories={categories}
              selectedCategory={category}
              onCategoryChange={(cat) => updateParam('category', cat)}
              sortBy={sortBy}
              onSortChange={(sort) => updateParam('sort_by', sort)}
              inStockOnly={inStockOnly}
              onInStockChange={(val) => updateParam('in_stock', val)}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={(val) => updateParam('min_price', val)}
              onMaxPriceChange={(val) => updateParam('max_price', val)}
              onResetFilters={handleResetFilters}
              totalResults={products.length}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'auto' }}
            >
              Show {products.length} Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

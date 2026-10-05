import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated User Routes */}
                    <Route 
                      path="/checkout" 
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/order-confirmation/:id" 
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders/:id" 
                      element={
                        <ProtectedRoute>
                          <OrderDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <UserProfile />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } 
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

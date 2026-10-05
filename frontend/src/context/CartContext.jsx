import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'aura_cart_v1';
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50.0;
const STANDARD_SHIPPING_COST = 5.99;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from storage:', e);
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showToast(`Sorry, "${product?.name || 'this item'}" is currently out of stock.`, 'error');
      return false;
    }

    let addedSuccessfully = false;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          showToast(
            `Cannot add more. Maximum available stock for "${product.name}" is ${product.stock}. (You already have ${currentQty} in cart)`,
            'error'
          );
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          product, // Update with latest product price/stock info
          quantity: newQty,
        };
        showToast(`Updated quantity of "${product.name}" to ${newQty}`, 'success');
        addedSuccessfully = true;
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} items available in stock.`, 'error');
          return prevItems;
        }

        showToast(`Added "${product.name}" to your cart!`, 'success');
        addedSuccessfully = true;
        return [...prevItems, { product, quantity }];
      }
    });

    return addedSuccessfully;
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product.id === productId);
      if (!item) return prevItems;

      if (newQuantity <= 0) {
        showToast(`Removed "${item.product.name}" from cart`, 'info');
        return prevItems.filter((i) => i.product.id !== productId);
      }

      if (newQuantity > item.product.stock) {
        showToast(`Only ${item.product.stock} units available in stock.`, 'warning');
        return prevItems.map((i) => (i.product.id === productId ? { ...i, quantity: item.product.stock } : i));
      }

      return prevItems.map((i) => (i.product.id === productId ? { ...i, quantity: newQuantity } : i));
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product.id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart`, 'info');
      }
      return prevItems.filter((i) => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    shipping,
    total,
    totalItemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

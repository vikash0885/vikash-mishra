import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pizza, size, quantity, customizations) => {
    setCartItems((prev) => {
      // Create a unique hash for this item variant
      const customizationStr = JSON.stringify(customizations || {});
      const existingItemIndex = prev.findIndex(
        (item) => 
          item.pizza._id === pizza._id && 
          item.size === size &&
          JSON.stringify(item.customizations || {}) === customizationStr
      );

      if (existingItemIndex >= 0) {
        // Increment quantity if exact match exists
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        // Calculate price for this size
        const price = pizza.prices[size.toLowerCase()];
        return [...prev, { pizza, size, price, quantity, customizations }];
      }
    });
    
    showToast('Added to cart', 'success');
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Removed from cart', 'info');
  };

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    setCartItems((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Derived state
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const gst = subtotal * 0.05;
  const deliveryCharges = cartItems.length > 0 ? 40 : 0;
  const totalAmount = subtotal + gst + deliveryCharges;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        gst,
        deliveryCharges,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

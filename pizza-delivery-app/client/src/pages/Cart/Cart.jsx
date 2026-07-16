import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import CartItem from '../../components/CartItem/CartItem';
import './Cart.css';

const Cart = () => {
  const { cartItems, clearCart, subtotal, gst, deliveryCharges, totalAmount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty container">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p className="text-muted">Looks like you haven't added any pizzas yet.</p>
        <Link to="/menu" className="btn btn-primary mt-4">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Your Cart</h1>
      
      <div className="cart-grid">
        <div className="cart-items-col">
          <div className="cart-items-header">
            <h3>Items ({cartItems.length})</h3>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
          
          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <CartItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
        
        <div className="cart-summary-col">
          <div className="cart-summary-card animate-slide-in-right">
            <h3>Price Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>{formatPrice(gst)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>{formatPrice(deliveryCharges)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="text-primary">{formatPrice(totalAmount)}</span>
            </div>
            
            <button 
              className="btn btn-primary btn-checkout" 
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            
            {!isAuthenticated && (
              <p className="auth-notice text-muted text-center mt-2">
                <small>You will be asked to login before checkout</small>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

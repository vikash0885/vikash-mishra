import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item, index }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { pizza, size, price, quantity, customizations } = item;

  const handleDecrease = () => updateQuantity(index, quantity - 1);
  const handleIncrease = () => updateQuantity(index, quantity + 1);

  return (
    <div className="cart-item animate-fade-in">
      <div className="cart-item-image-wrapper">
        <img 
          src={pizza.image || 'https://via.placeholder.com/100?text=Pizza'} 
          alt={pizza.name} 
          className="cart-item-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100?text=Pizza';
          }}
        />
      </div>
      
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h4 className="cart-item-name">{pizza.name}</h4>
          <span className="cart-item-size badge badge-classic">{size}</span>
        </div>
        
        {customizations && Object.keys(customizations).length > 0 && (
          <div className="cart-item-customizations">
            {customizations.base && <span>Base: {customizations.base}</span>}
            {customizations.sauce && <span>Sauce: {customizations.sauce}</span>}
            {customizations.cheese && <span>Cheese: {customizations.cheese}</span>}
            {customizations.vegetables && customizations.vegetables.length > 0 && (
              <span>Veg: {customizations.vegetables.join(', ')}</span>
            )}
          </div>
        )}
        
        <div className="cart-item-price-unit">
          {formatPrice(price)} each
        </div>
      </div>
      
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button className="qty-btn" onClick={handleDecrease}><FiMinus /></button>
          <span className="qty-display">{quantity}</span>
          <button className="qty-btn" onClick={handleIncrease}><FiPlus /></button>
        </div>
        
        <div className="cart-item-total">
          {formatPrice(price * quantity)}
        </div>
        
        <button 
          className="remove-btn" 
          onClick={() => removeFromCart(index)}
          title="Remove item"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

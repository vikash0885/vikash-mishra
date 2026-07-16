import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import Spinner from '../../components/Spinner/Spinner';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, gst, deliveryCharges, totalAmount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Pre-fill address if user has one
    if (user?.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        pincode: user.address.pincode || ''
      });
    }
  }, [cartItems, navigate, user]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate address
    if (!address.street || !address.city || !address.state || !address.pincode) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          pizza: item.pizza._id,
          name: item.pizza.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          customizations: item.customizations
        })),
        subtotal,
        gst,
        deliveryCharges,
        totalAmount,
        deliveryAddress: address
      };

      const res = await orderService.createOrder(orderData);
      
      // Navigate to payment page with order ID
      navigate('/payment', { state: { order: res.data } });
      
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner text="Creating order..." />;

  return (
    <div className="checkout-page container">
      <h1 className="page-title text-center">Checkout</h1>
      
      <div className="checkout-grid">
        <div className="checkout-form-col animate-slide-up">
          <div className="glass-card">
            <h2 className="mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  value={address.street}
                  onChange={handleChange}
                  required
                  placeholder="House No, Building, Street Area"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={address.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={address.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={address.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full mt-4">
                Continue to Payment
              </button>
            </form>
          </div>
        </div>
        
        <div className="checkout-summary-col">
          <div className="glass-card sticky-card">
            <h3 className="mb-4">Order Summary</h3>
            
            <div className="checkout-items">
              {cartItems.map((item, idx) => (
                <div key={idx} className="checkout-item">
                  <span className="qty">{item.quantity}x</span>
                  <div className="name-size">
                    <span className="name">{item.pizza.name}</span>
                    <span className="size text-muted">{item.size}</span>
                  </div>
                  <span className="price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>{formatPrice(gst)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatPrice(deliveryCharges)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total to Pay</span>
              <span className="text-primary">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

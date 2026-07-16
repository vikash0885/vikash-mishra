import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { paymentService } from '../../services/paymentService';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import Spinner from '../../components/Spinner/Spinner';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', null
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // If no order data passed via state, redirect
    if (!location.state || !location.state.order) {
      navigate('/cart');
      return;
    }
    setOrderData(location.state.order);
  }, [location, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 2. Create Razorpay order on our backend
      const res = await paymentService.createRazorpayOrder(
        orderData.totalAmount, 
        orderData._id
      );

      const rzpOrder = res.data;

      // 3. Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxx', 
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'PizzaHub',
        description: 'Pizza Order Payment',
        image: '/vite.svg',
        order_id: rzpOrder.id,
        handler: async function (response) {
          setLoading(true);
          try {
            // 4. Verify payment on our backend
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id
            });
            
            setPaymentStatus('success');
            clearCart();
          } catch (err) {
            console.error('Payment verification failed:', err);
            setPaymentStatus('failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: orderData.deliveryAddress.name || 'User',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#E65100'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      // 4. Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error(response.error);
        setPaymentStatus('failed');
        setLoading(false);
      });

      rzp.open();
      
    } catch (error) {
      console.error(error);
      alert('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (!orderData) return <Spinner />;

  if (paymentStatus === 'success') {
    return (
      <div className="payment-result-page container animate-slide-up">
        <div className="glass-card result-card">
          <FiCheckCircle className="result-icon success" />
          <h2>Payment Successful!</h2>
          <p className="text-muted">Your order #{orderData._id.slice(-6)} has been placed successfully.</p>
          <div className="result-actions">
            <Link to="/orders" className="btn btn-primary">Track Order</Link>
            <Link to="/menu" className="btn btn-outline">Back to Menu</Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="payment-result-page container animate-slide-up">
        <div className="glass-card result-card">
          <FiXCircle className="result-icon failed" />
          <h2>Payment Failed</h2>
          <p className="text-muted">We couldn't process your payment. Don't worry, your order is saved.</p>
          <div className="result-actions">
            <button onClick={() => setPaymentStatus(null)} className="btn btn-primary">Try Again</button>
            <Link to="/orders" className="btn btn-outline">View Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page container">
      <h1 className="page-title text-center">Complete Payment</h1>
      
      <div className="payment-card glass-card animate-slide-up">
        <div className="order-summary-mini">
          <h3>Order #{orderData._id.slice(-6).toUpperCase()}</h3>
          <p className="text-muted">Total amount to pay</p>
          <div className="payment-amount">{formatPrice(orderData.totalAmount)}</div>
        </div>
        
        <div className="test-card-notice">
          <h4>Test Mode Enabled</h4>
          <p>Use any dummy card details for testing.</p>
          <ul>
            <li>Card: 4111 1111 1111 1111</li>
            <li>Expiry: Any future date (e.g. 12/26)</li>
            <li>CVV: 123</li>
            <li>OTP: 1234</li>
          </ul>
        </div>
        
        <button 
          className="btn btn-primary btn-pay" 
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ${formatPrice(orderData.totalAmount)} securely`}
        </button>
      </div>
    </div>
  );
};

export default Payment;

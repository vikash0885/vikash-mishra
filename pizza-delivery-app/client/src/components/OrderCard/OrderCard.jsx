import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { formatPrice, formatDate, getStatusColor, getStatusStep } from '../../utils/helpers';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  const currentStep = getStatusStep(order.status);
  
  const steps = [
    { label: 'Received', icon: <FiClock /> },
    { label: 'Preparing', icon: <FiPackage /> },
    { label: 'Delivery', icon: <FiTruck /> },
    { label: 'Delivered', icon: <FiCheckCircle /> }
  ];

  return (
    <div className="order-card animate-slide-up">
      <div className="order-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="order-main-info">
          <div className="order-id">
            <span className="label">Order ID</span>
            <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="order-date">
            <span className="label">Placed On</span>
            <span className="value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="order-total">
            <span className="label">Total Amount</span>
            <span className="value text-primary">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
        
        <div className="order-status-badge">
          <span 
            className="status-dot" 
            style={{ backgroundColor: getStatusColor(order.status) }}
          ></span>
          {order.status}
        </div>
        
        <button className="expand-btn">
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      {order.status !== 'Cancelled' && (
        <div className="order-progress-tracker">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`tracker-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      )}
      
      {order.status === 'Cancelled' && (
        <div className="order-cancelled-msg">
          <FiXCircle className="error-icon" /> This order was cancelled.
        </div>
      )}

      {expanded && (
        <div className="order-details animate-fade-in">
          <div className="order-items-list">
            <h4 className="details-heading">Items ({order.items.length})</h4>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <div className="item-qty-name">
                  <span className="item-qty">{item.quantity}x</span>
                  <span className="item-name">{item.name} ({item.size})</span>
                </div>
                <div className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary-grid">
            <div className="order-delivery-address">
              <h4 className="details-heading">Delivery Address</h4>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>{order.deliveryAddress.pincode}</p>
            </div>
            
            <div className="order-price-breakdown">
              <h4 className="details-heading">Payment Summary</h4>
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="breakdown-row">
                <span>GST (5%)</span>
                <span>{formatPrice(order.gst)}</span>
              </div>
              <div className="breakdown-row">
                <span>Delivery</span>
                <span>{formatPrice(order.deliveryCharges)}</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="payment-status">
                Payment: <span className={order.paymentStatus === 'success' ? 'text-success' : 'text-warning'}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

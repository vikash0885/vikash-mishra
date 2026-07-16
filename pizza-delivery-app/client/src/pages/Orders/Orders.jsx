import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import OrderCard from '../../components/OrderCard/OrderCard';
import Spinner from '../../components/Spinner/Spinner';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getUserOrders();
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="orders-page container">
      <h1 className="page-title text-center">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders glass-card">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p className="text-muted">You haven't placed any orders with us yet.</p>
          <Link to="/menu" className="btn btn-primary mt-4">Start Ordering</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import Spinner from '../../../components/Spinner/Spinner';
import { formatPrice, formatDate, getStatusColor } from '../../../utils/helpers';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminService.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="manage-orders animate-fade-in">
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="font-mono text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{formatDate(order.createdAt).split(',')[0]}</td>
                  <td>
                    <div className="customer-info">
                      <span className="name">{order.user.name}</span>
                      <span className="phone text-muted text-xs">{order.user.phone || 'No phone'}</span>
                    </div>
                  </td>
                  <td className="font-bold text-primary">{formatPrice(order.totalAmount)}</td>
                  <td>
                    <span className={`status-pill ${order.paymentStatus === 'success' ? 'success' : 'warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="status-select"
                      style={{ 
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                        borderColor: getStatusColor(order.status)
                      }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                    >
                      <option value="Order Received">Order Received</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;

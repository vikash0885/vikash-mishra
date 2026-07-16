import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { adminService } from '../../../services/adminService';
import Spinner from '../../../components/Spinner/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="admin-dashboard animate-fade-in">
      <h1 className="admin-page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 152, 219, 0.2)', color: '#3498db' }}>
            <FiShoppingBag />
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71' }}>
            <FiDollarSign />
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6' }}>
            <FiBox />
          </div>
          <div className="stat-details">
            <h3>Menu Items</h3>
            <p className="stat-value">{stats?.totalPizzas || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(230, 126, 34, 0.2)', color: '#e67e22' }}>
            <FiUsers />
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-quick-actions mt-4">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/orders" className="action-card">
            <h4>Manage Orders</h4>
            <p>View and update current orders</p>
          </Link>
          <Link to="/admin/pizzas" className="action-card">
            <h4>Manage Menu</h4>
            <p>Add or edit pizzas</p>
          </Link>
          <Link to="/admin/inventory" className="action-card">
            <h4>Inventory</h4>
            <p>Check stock levels</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

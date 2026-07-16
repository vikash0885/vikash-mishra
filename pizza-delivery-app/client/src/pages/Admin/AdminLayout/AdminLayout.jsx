import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBox, FiShoppingBag, FiLayers, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { adminLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { path: '/admin/pizzas', icon: <FiBox />, label: 'Pizzas' },
    { path: '/admin/inventory', icon: <FiLayers />, label: 'Inventory' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🍕</span>
          <span>AdminPanel</span>
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        
        <button className="admin-logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </aside>
      
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
          </div>
          <div className="admin-header-user">
            <span>Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

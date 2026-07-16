import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍕</span>
          <span className="gradient-text">PizzaHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links desktop-only">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>Menu</Link>
          {isAuthenticated && (
            <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>Orders</Link>
          )}
        </nav>

        <div className="navbar-actions desktop-only">
          <Link to="/cart" className="cart-icon-wrapper">
            <FiShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="profile-dropdown-wrapper">
              <button 
                className="profile-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="profile-dropdown animate-slide-up">
                  <Link to="/profile"><FiUser /> Profile</Link>
                  <button onClick={logout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle mobile-only btn-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          {isAuthenticated && <Link to="/orders">My Orders</Link>}
          <Link to="/cart">
            Cart <span className="mobile-cart-count">({cartCount})</span>
          </Link>
          
          <div className="mobile-menu-divider"></div>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile ({user?.name})</Link>
              <button onClick={logout} className="mobile-logout-btn">Logout</button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <span className="logo-icon">🍕</span>
              <span className="gradient-text">PizzaHub</span>
            </Link>
            <p className="text-muted">
              Delivering happiness, one slice at a time. The best authentic pizzas with fresh ingredients.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><FiInstagram /></a>
              <a href="#" className="social-icon"><FiFacebook /></a>
              <a href="#" className="social-icon"><FiTwitter /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Refund Policy</Link></li>
              <li><Link to="/admin/login" className="admin-link">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul>
              <li><FiMapPin /> 123 Pizza Street, Food City</li>
              <li><FiPhone /> +91 98765 43210</li>
              <li><FiMail /> support@pizzahub.com</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="text-muted">
            &copy; {new Date().getFullYear()} PizzaHub by Vikash Mishra. All rights reserved. <br/>
            <small>Oasis Infobyte Level 3 Project</small>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

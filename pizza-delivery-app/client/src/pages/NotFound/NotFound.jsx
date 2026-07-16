import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 0', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Oops! You've lost your way.</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">Go Back Home</Link>
    </div>
  );
};

export default NotFound;

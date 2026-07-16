import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner/Spinner';

const AdminRoute = () => {
  const { isAdminAuthenticated, loading } = useAuth();

  // For admin routes, if the main app is still loading auth state, we might wait
  // However, admin state is managed separately in AuthContext
  if (loading) {
    return <Spinner />;
  }

  return isAdminAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;

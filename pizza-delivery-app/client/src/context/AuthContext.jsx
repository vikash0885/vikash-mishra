import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (error) {
          console.error("Token invalid", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      showToast('Logged in successfully', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      showToast('Registered successfully', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    showToast('Logged out', 'info');
  };

  const updateProfile = async (userData) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      showToast('Profile updated', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      setAdminToken(res.data.token);
      setAdmin(res.data.admin);
      showToast('Admin logged in', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Admin login failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast-item animate-slide-in-right ${toast.type}`}
            style={{
              background: 'var(--card-bg)',
              border: `1px solid ${
                toast.type === 'success' ? 'var(--success)' : 
                toast.type === 'error' ? 'var(--error)' : 'var(--primary)'
              }`,
              color: 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: 'var(--shadow-lg)',
              minWidth: '250px'
            }}
          >
            <div style={{ 
              color: toast.type === 'success' ? 'var(--success)' : 
                     toast.type === 'error' ? 'var(--error)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center'
            }}>
              {toast.type === 'success' && <FiCheckCircle size={20} />}
              {toast.type === 'error' && <FiAlertCircle size={20} />}
              {(toast.type === 'info' || toast.type === 'warning') && <FiInfo size={20} />}
            </div>
            
            <p style={{ margin: 0, flex: 1, fontSize: '0.9rem' }}>{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
            >
              <FiX size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

import axios from 'axios';

// Create a separate instance for admin to not mix tokens
const adminApi = axios.create({
  baseURL: '/api/admin'
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminService = {
  getDashboard: async () => {
    const res = await adminApi.get('/dashboard');
    return res.data;
  },
  
  // Pizzas
  getAllPizzas: async () => {
    const res = await adminApi.get('/pizzas');
    return res.data;
  },
  addPizza: async (formData) => {
    const res = await adminApi.post('/pizzas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  updatePizza: async (id, formData) => {
    const res = await adminApi.put(`/pizzas/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  deletePizza: async (id) => {
    const res = await adminApi.delete(`/pizzas/${id}`);
    return res.data;
  },

  // Orders
  getAllOrders: async () => {
    const res = await adminApi.get('/orders');
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await adminApi.put(`/orders/${id}/status`, { status });
    return res.data;
  },
  cancelOrder: async (id) => {
    const res = await adminApi.delete(`/orders/${id}`);
    return res.data;
  },

  // Inventory
  getInventory: async () => {
    const res = await adminApi.get('/inventory');
    return res.data;
  },
  addInventoryItem: async (data) => {
    const res = await adminApi.post('/inventory', data);
    return res.data;
  },
  updateInventoryItem: async (id, data) => {
    const res = await adminApi.put(`/inventory/${id}`, data);
    return res.data;
  },
  deleteInventoryItem: async (id) => {
    const res = await adminApi.delete(`/inventory/${id}`);
    return res.data;
  }
};

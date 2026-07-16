import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and maybe redirect to login if we wanted to force it
      // but Context usually handles this. Here we just ensure storage is clean
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;

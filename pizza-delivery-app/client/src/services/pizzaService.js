import api from './api';

export const pizzaService = {
  getAllPizzas: async (search = '', category = 'All') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    
    const response = await api.get(`/pizzas?${params.toString()}`);
    return response.data;
  },

  getPizzaById: async (id) => {
    const response = await api.get(`/pizzas/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/pizzas/categories/all');
    return response.data;
  }
};

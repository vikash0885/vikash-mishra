import api from './api';

export const paymentService = {
  createRazorpayOrder: async (amount, orderId) => {
    const response = await api.post('/payment/create-order', { amount, orderId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  }
};

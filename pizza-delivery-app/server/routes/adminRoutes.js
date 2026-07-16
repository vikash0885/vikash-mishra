const express = require('express');
const {
  adminLogin,
  getDashboard,
  getAllPizzas,
  addPizza,
  updatePizza,
  deletePizza,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public route for admin login
router.post('/login', adminLogin);

// Protected routes
router.use(protectAdmin);

router.get('/dashboard', getDashboard);

router.route('/pizzas')
  .get(getAllPizzas)
  .post(upload.single('image'), addPizza);

router.route('/pizzas/:id')
  .put(upload.single('image'), updatePizza)
  .delete(deletePizza);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', cancelOrder);

module.exports = router;

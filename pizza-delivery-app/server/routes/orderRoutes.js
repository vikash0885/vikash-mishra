const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes are protected
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.get('/:id', getOrderById);

module.exports = router;

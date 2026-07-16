const express = require('express');
const {
  getAllInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventoryController');
const { protectAdmin } = require('../middleware/adminAuth');

const router = express.Router();

// All inventory routes require admin auth
router.use(protectAdmin);

router.route('/')
  .get(getAllInventory)
  .post(addInventoryItem);

router.route('/:id')
  .put(updateInventoryItem)
  .delete(deleteInventoryItem);

module.exports = router;

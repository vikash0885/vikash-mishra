const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getAllInventory = async (req, res, next) => {
  try {
    // Optionally filter by type via query
    const query = req.query.type ? { type: req.query.type } : {};
    const inventory = await Inventory.find(query).sort('type name');
    
    // Grouping can be done on the frontend, but we return all data here
    res.json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new inventory item
// @route   POST /api/admin/inventory
// @access  Private/Admin
const addInventoryItem = async (req, res, next) => {
  try {
    const { type, name, quantity, unit, pricePerUnit } = req.body;

    const item = await Inventory.create({
      type,
      name,
      quantity,
      unit,
      pricePerUnit
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/admin/inventory/:id
// @access  Private/Admin
const updateInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/admin/inventory/:id
// @access  Private/Admin
const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    res.json({ success: true, message: 'Inventory item removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};

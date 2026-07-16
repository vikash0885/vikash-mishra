const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

// Helper to deduct inventory
const deductInventory = async (items) => {
  for (const item of items) {
    const qty = item.quantity;
    const { customizations } = item;
    
    if (!customizations) continue;

    // Deduct base
    if (customizations.base) {
      await Inventory.findOneAndUpdate(
        { type: 'base', name: customizations.base },
        { $inc: { quantity: -qty } }
      );
    }
    
    // Deduct sauce
    if (customizations.sauce) {
      await Inventory.findOneAndUpdate(
        { type: 'sauce', name: customizations.sauce },
        { $inc: { quantity: -qty } }
      );
    }
    
    // Deduct cheese
    if (customizations.cheese) {
      await Inventory.findOneAndUpdate(
        { type: 'cheese', name: customizations.cheese },
        { $inc: { quantity: -qty } }
      );
    }
    
    // Deduct veggies
    if (customizations.vegetables && customizations.vegetables.length > 0) {
      for (const veg of customizations.vegetables) {
        await Inventory.findOneAndUpdate(
          { type: 'vegetable', name: veg },
          { $inc: { quantity: -qty } }
        );
      }
    }
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      subtotal,
      gst,
      deliveryCharges,
      totalAmount,
      deliveryAddress
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      gst,
      deliveryCharges,
      totalAmount,
      deliveryAddress
    });

    const createdOrder = await order.save();
    
    // Deduct from inventory based on customizations
    await deductInventory(items);

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to user or if admin
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};

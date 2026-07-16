const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token: generateToken(admin._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPizzas = await Pizza.countDocuments();
    
    const orders = await Order.find({ paymentStatus: 'success' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalPizzas,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pizzas (including unavailable)
// @route   GET /api/admin/pizzas
// @access  Private/Admin
const getAllPizzas = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({});
    res.json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a pizza
// @route   POST /api/admin/pizzas
// @access  Private/Admin
const addPizza = async (req, res, next) => {
  try {
    const { name, description, small, medium, large, category, isVeg, isAvailable } = req.body;
    
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const pizza = await Pizza.create({
      name,
      description,
      prices: {
        small: Number(small),
        medium: Number(medium),
        large: Number(large)
      },
      category: category.toLowerCase(),
      image: imagePath,
      isVeg: isVeg === 'true',
      isAvailable: isAvailable !== 'false'
    });

    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pizza
// @route   PUT /api/admin/pizzas/:id
// @access  Private/Admin
const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    const { name, description, small, medium, large, category, isVeg, isAvailable } = req.body;

    pizza.name = name || pizza.name;
    pizza.description = description || pizza.description;
    
    if (small || medium || large) {
      pizza.prices = {
        small: small ? Number(small) : pizza.prices.small,
        medium: medium ? Number(medium) : pizza.prices.medium,
        large: large ? Number(large) : pizza.prices.large
      };
    }
    
    pizza.category = category ? category.toLowerCase() : pizza.category;
    pizza.isVeg = isVeg !== undefined ? isVeg === 'true' : pizza.isVeg;
    pizza.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : pizza.isAvailable;

    if (req.file) {
      pizza.image = `/uploads/${req.file.filename}`;
    }

    const updatedPizza = await pizza.save();
    res.json({ success: true, data: updatedPizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pizza
// @route   DELETE /api/admin/pizzas/:id
// @access  Private/Admin
const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.json({ success: true, message: 'Pizza removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email phone').sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(status)) {
       return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getDashboard,
  getAllPizzas,
  addPizza,
  updatePizza,
  deletePizza,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};

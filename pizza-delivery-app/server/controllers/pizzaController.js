const Pizza = require('../models/Pizza');

// @desc    Get all pizzas (available ones by default)
// @route   GET /api/pizzas
// @access  Public
const getAllPizzas = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = { isAvailable: true };

    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const pizzas = await Pizza.find(query);
    res.json({ success: true, count: pizzas.length, data: pizzas });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pizza
// @route   GET /api/pizzas/:id
// @access  Public
const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct pizza categories
// @route   GET /api/pizzas/categories/all
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Pizza.distinct('category', { isAvailable: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  getCategories
};

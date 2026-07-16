const express = require('express');
const {
  getAllPizzas,
  getPizzaById,
  getCategories
} = require('../controllers/pizzaController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);

module.exports = router;

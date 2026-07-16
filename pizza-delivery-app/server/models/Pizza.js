/**
 * Pizza Model
 * Represents a pizza item on the menu with tiered pricing,
 * category classification, and availability status.
 */

const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prices: {
      small: {
        type: Number,
        required: [true, 'Small price is required'],
      },
      medium: {
        type: Number,
        required: [true, 'Medium price is required'],
      },
      large: {
        type: Number,
        required: [true, 'Large price is required'],
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['veg', 'non-veg', 'premium', 'classic'],
        message: '{VALUE} is not a valid category',
      },
    },
    image: {
      type: String,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pizza', pizzaSchema);

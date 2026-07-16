/**
 * Inventory Model
 * Tracks available customization ingredients such as bases,
 * sauces, cheeses, and vegetables with quantities and pricing.
 */

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Inventory type is required'],
      enum: {
        values: ['base', 'sauce', 'cheese', 'vegetable'],
        message: '{VALUE} is not a valid inventory type',
      },
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 100,
    },
    unit: {
      type: String,
      default: 'units',
    },
    pricePerUnit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);

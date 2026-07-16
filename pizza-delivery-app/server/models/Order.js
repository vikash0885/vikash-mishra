/**
 * Order Model
 * Tracks a customer's pizza order including line items with
 * customizations, pricing breakdown, delivery address,
 * order status lifecycle, and payment status.
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
        },
        name: { type: String },
        price: { type: Number },
        size: { type: String },
        quantity: { type: Number, default: 1 },
        customizations: {
          base: { type: String },
          sauce: { type: String },
          cheese: { type: String },
          vegetables: [{ type: String }],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
    },
    gst: {
      type: Number,
      required: [true, 'GST amount is required'],
    },
    deliveryCharges: {
      type: Number,
      required: [true, 'Delivery charges are required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: [
        'Order Received',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Received',
    },
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

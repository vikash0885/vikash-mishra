const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: 'Amount and Order ID required' });
    }

    // Verify order belongs to user
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (dbOrder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${orderId.toString().slice(-6)}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Some error occurred while creating order' });
    }

    // Save initial payment record
    await Payment.create({
      order: orderId,
      user: req.user._id,
      razorpayOrderId: order.id,
      amount: amount,
      status: 'created'
    });

    res.json({
      success: true,
      data: {
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Update Payment record
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          razorpayPaymentId: razorpay_payment_id, 
          razorpaySignature: razorpay_signature,
          status: 'success' 
        }
      );

      // Update Order record
      await Order.findByIdAndUpdate(orderId, {
        paymentId: razorpay_payment_id,
        paymentStatus: 'success',
      });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      
      // Update Payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
      });

      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};

const express = require('express');
const Order = require('../models/Order');
const { sendThankYouEmail } = require('../utils/email');
const router = express.Router();

// Checkout
router.get('/', (req, res) => {
    res.render('checkout', { title: 'Checkout', cart: req.session.cart || [] });
});

// Complete checkout
router.post('/', async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const user = req.session.user;

        const newOrder = new Order({
            user: user._id,
            products: req.session.cart.map(item => ({ product: item._id, quantity: item.quantity })),
            totalAmount: req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            paymentStatus: 'Pending'
        });

        const savedOrder = await newOrder.save();
        req.session.cart = [];

        res.redirect(`/api/checkout/payment?orderId=${savedOrder._id}&paymentMethod=${paymentMethod}`);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Payment page
router.get('/payment', (req, res) => {
    const { orderId, paymentMethod } = req.query;
    res.render('payment', { title: 'Payment', orderId, paymentMethod });
});

// Simulate payment and update order status
router.post('/payment', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'Completed';
        await order.save();

        // Send thank you email with invoice
        sendThankYouEmail(order);

        res.render('thankyou', { title: 'Thank You', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

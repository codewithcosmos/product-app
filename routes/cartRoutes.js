const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendThankYouEmail } = require('../utils/email');
const router = express.Router();

// Add product to cart
router.post('/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingProductIndex = req.session.cart.findIndex(p => p._id.toString() === productId);
        if (existingProductIndex !== -1) {
            req.session.cart[existingProductIndex].quantity += 1;
        } else {
            req.session.cart.push({ ...product.toObject(), quantity: 1 });
        }

        res.json({ message: 'Product added to cart', cart: req.session.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// View cart
router.get('/', (req, res) => {
    res.render('cart', { title: 'Cart', cart: req.session.cart || [] });
});

// Checkout page
router.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Checkout', cart: req.session.cart || [] });
});

// Complete checkout
router.post('/checkout', async (req, res) => {
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

        res.redirect(`/api/cart/payment?orderId=${savedOrder._id}&paymentMethod=${paymentMethod}`);
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

// Fetch all items in the cart
router.get('/items', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add an item to the cart
router.post('/items', async (req, res) => {
    try {
        const newItem = new Cart(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Complete cart checkout
router.post('/cart/checkout', async (req, res) => {
    try {
        const orderDetails = req.body;
        // Handle checkout logic, e.g., create an order, clear the cart, etc.
        res.json({ message: 'Checkout successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

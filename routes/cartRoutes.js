const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get cart items
router.get('/', (req, res) => {
    const cart = req.session.cart || [];
    res.json(cart);
});

// Add item to cart
router.post('/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.session.cart = req.session.cart || [];
        req.session.cart.push(product);
        res.json(req.session.cart); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove item from cart
router.post('/remove/:productId', (req, res) => {
    const productId = req.params.productId;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id.toString() !== productId);
    }
    res.json(req.session.cart); 
});

// Clear the cart
router.post('/clear', (req, res) => {
    req.session.cart = [];
    res.json({ message: 'Cart cleared' });
});

module.exports = router;

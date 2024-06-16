const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

// Middleware to check authentication and admin role
const authenticateAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.role !== 'admin') return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get all users (Admin only)
router.get('/users', authenticateAdminToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

// Get a specific user by ID (Admin only)
router.get('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

// Update user (Admin only)
router.put('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

// Get all products (Admin only)
router.get('/products', authenticateAdminToken, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// Create a new product (Admin only)
router.post('/products', authenticateAdminToken, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        const newProduct = new Product({ name, description, price, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err.message });
    }
});

// Update a product (Admin only)
router.put('/products/:id', authenticateAdminToken, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, price, image }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
    }
});

// Delete a product (Admin only)
router.delete('/products/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});

// Get all quotes (Admin only)
router.get('/quotes', authenticateAdminToken, async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching quotes', error: err.message });
    }
});

// Get all invoices (Admin only)
router.get('/invoices', authenticateAdminToken, async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoices', error: err.message });
    }
});

module.exports = router;

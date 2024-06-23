import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Import models and their methods
import { findOne, find as findUsers, findById as findUserById, findByIdAndUpdate as updateUserById, findByIdAndDelete as deleteUserById } from '../models/User.mjs';
import Product, { find as findProducts, findByIdAndUpdate as updateProductById, findByIdAndDelete as deleteProductById } from '../models/Product.mjs';
import Quote from '../models/Quote.mjs';
import Invoice from '../models/Invoice.mjs';

dotenv.config();

const router = Router();
const { compare } = bcrypt;
const { verify, sign } = jwt;
const jwtSecret = process.env.JWT_SECRET;

// Middleware to check authentication and admin role
const authenticateAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    verify(token, jwtSecret, (err, user) => {
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
        const user = await findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// User routes (Admin only)
router.get('/users', authenticateAdminToken, async (req, res) => {
    try {
        const users = await findUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

router.get('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const user = await findUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
});

router.put('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const updatedUser = await updateUserById(req.params.id, { username, email, role }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

router.delete('/users/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedUser = await deleteUserById(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

// Product routes (Admin only)
router.get('/products', authenticateAdminToken, async (req, res) => {
    try {
        const products = await findProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

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

router.put('/products/:id', authenticateAdminToken, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        const updatedProduct = await updateProductById(req.params.id, { name, description, price, image }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
    }
});

router.delete('/products/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedProduct = await deleteProductById(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});

// Quote routes (Admin only)
router.get('/quotes', authenticateAdminToken, async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching quotes', error: err.message });
    }
});

// Invoice routes (Admin only)
router.get('/invoices', authenticateAdminToken, async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoices', error: err.message });
    }
});

router.get('/invoices/:id', authenticateAdminToken, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching invoice', error: err.message });
    }
});

router.put('/invoices/:id', authenticateAdminToken, async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(updatedInvoice);
    } catch (err) {
        res.status(500).json({ message: 'Error updating invoice', error: err.message });
    }
});

router.delete('/invoices/:id', authenticateAdminToken, async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting invoice', error: err.message });
    }
});

export default router;

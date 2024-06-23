import { Router } from 'express';
const router = Router();
import Product, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/Product.mjs';

// Get all products
router.get('/', async (_req, res) => {
    try {
        const products = await find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific product
router.get('/:id', async (req, res) => {
    try {
        const product = await findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
        image,
        category,
        stock
    });
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

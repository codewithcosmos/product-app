// controllers/productController.js
import { find, findById } from '../models/Product';

export async function getAllProducts(_req, res) {
    try {
        const products = await find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

import { findOne } from '../models/Cart.mjs';
import { findById } from '../models/Product.mjs';

export async function getCart(req, res) {
    try {
        const cart = await findOne({ user: req.user.id }).populate('products.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function addToCart(req, res) {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    try {
        const cart = await findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        const product = await findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cartProduct = cart.products.find(p => p.product.equals(productId));
        if (cartProduct) {
            cartProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

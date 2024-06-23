import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the schema for the Cart
const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Cart = model('Cart', cartSchema);

// Methods to interact with the Cart model
export const findCartByUserId = async (userId) => {
    try {
        return await Cart.findOne({ userId }).populate('items.productId');
    } catch (error) {
        throw new Error(`Error finding cart for user with id ${userId}: ${error.message}`);
    }
};

export const addToCart = async (userId, productId, quantity = 1) => {
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
            await cart.save();
        } else {
            // Check if the product is already in the cart
            const existingItem = cart.items.find(item => item.productId.equals(productId));

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
        }

        return cart.populate('items.productId').execPopulate();
    } catch (error) {
        throw new Error(`Error adding product ${productId} to cart: ${error.message}`);
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw new Error(`Cart not found for user with id ${userId}`);
        }

        cart.items = cart.items.filter(item => !item.productId.equals(productId));
        await cart.save();

        return cart.populate('items.productId').execPopulate();
    } catch (error) {
        throw new Error(`Error removing product ${productId} from cart: ${error.message}`);
    }
};

export const clearCart = async (userId) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            throw new Error(`Cart not found for user with id ${userId}`);
        }
        return cart;
    } catch (error) {
        throw new Error(`Error clearing cart for user with id ${userId}: ${error.message}`);
    }
};

export default Cart;

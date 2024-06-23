// models/Order.mjs
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
    // Define your order schema fields
    customerName: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    // Add more fields as necessary
});

const Order = model('Order', orderSchema);

// Example function to find order by ID
export const findById = async (orderId) => {
    try {
        const order = await Order.findById(orderId);
        return order;
    } catch (error) {
        console.error('Error finding order by ID:', error);
        throw error;
    }
};

export default Order;

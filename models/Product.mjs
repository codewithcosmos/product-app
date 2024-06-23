// Product.mjs

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the schema for the Product
const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});

// Define the Product model
const Product = model('Product', productSchema);

export const find = () => Product.find();
export const findById = (id) => Product.findById(id);
export const findByIdAndUpdate = (id, update, options) => Product.findByIdAndUpdate(id, update, options);
export const findByIdAndDelete = (id) => Product.findByIdAndDelete(id);

// Example function to delete many products
export const deleteMany = async () => {
    try {
        const result = await Product.deleteMany({});
        console.log(`${result.deletedCount} products deleted.`);
    } catch (error) {
        console.error('Error deleting products:', error);
        throw error;
    }
};

// Example function to insert many products
export const insertMany = async (products) => {
    try {
        const result = await Product.insertMany(products);
        console.log(`${result.length} products inserted.`);
    } catch (error) {
        console.error('Error inserting products:', error);
        throw error;
    }
};

export default Product;

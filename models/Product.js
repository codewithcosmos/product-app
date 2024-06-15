// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    productId: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    inStock: { type: Boolean, default: true },
    category: { type: String, required: true } // Add the category field here
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

// models/Product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});


module.exports = mongoose.model('Product', productSchema);

// models/Cart.js
// const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    totalPrice: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Cart', cartSchema);

// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });

cartSchema.methods.getTotalPrice = function() {
    return this.populate('products.product')
        .execPopulate()
        .then(cart => {
            return cart.products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        });
};

module.exports = mongoose.model('Cart', cartSchema);

// models/Quote.js
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' } // pending, approved, rejected
}, { timestamps: true });

quoteSchema.methods.calculateTotal = function() {
    return this.populate('products.product')
        .execPopulate()
        .then(quote => {
            return quote.products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        });
};

module.exports = mongoose.model('Quote', quoteSchema);

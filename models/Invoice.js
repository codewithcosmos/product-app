// models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'unpaid' } // unpaid, paid, overdue
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);

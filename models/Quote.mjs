// models/Quote.mjs

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the schema for Quote
const quoteSchema = new Schema({
    customerName: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    totalAmount: { type: Number, required: true },
    validUntil: { type: Date, required: true }
    // Add more fields as needed
});

// Create the Quote model
const Quote = model('Quote', quoteSchema);

// Export the Quote model as the default export
export default Quote;

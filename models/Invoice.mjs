import mongoose from 'mongoose';

const { Schema } = mongoose;

const invoiceSchema = new Schema({
    client: String,
    description: String,
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    },
    dueDate: Date
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Export the necessary methods
export const find = () => Invoice.find();
export const findById = (id) => Invoice.findById(id);
export const findByIdAndUpdate = (id, update, options) => Invoice.findByIdAndUpdate(id, update, options);
export const findByIdAndDelete = (id) => Invoice.findByIdAndDelete(id);

export default Invoice;

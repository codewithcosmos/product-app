const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Define your schema here
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

// Check if the model is already compiled and use it, otherwise compile it
module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

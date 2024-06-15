// routes/checkout.js

const express = require('express');
const router = express.Router();

// POST route to process checkout
router.post('/process', async (req, res) => {
    // Extract form data
    const { fullname, email, phone, message } = req.body;

    // Process the checkout logic (e.g., generate invoice, send confirmation email, etc.)

    // Example: Saving to MongoDB or any other database
    try {
        // Save the order details to your database (MongoDB example)
        // This assumes you have a 'orders' collection in your MongoDB setup
        await Order.create({
            fullname,
            email,
            phone,
            message,
            products: req.session.cart, // Assuming you're using sessions for cart
            total: req.session.total, // Assuming you're calculating total in the session
            createdAt: new Date()
        });

        // Clear the cart after successful checkout
        req.session.cart = [];
        req.session.total = 0;

        // Redirect to a thank you or invoice page
        res.redirect('/invoice');
    } catch (err) {
        console.error('Error processing checkout:', err);
        res.status(500).send('Error processing checkout. Please try again later.');
    }
});

module.exports = router;

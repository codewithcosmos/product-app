import { Router } from 'express';
import Order, { findById } from '../models/Order.mjs';
// checkout.mjs
import { sendThankYouEmail } from '../utils/email.mjs'; // Import sendThankYouEmail function

const router = Router();

// Route for checkout process
router.post('/checkout', async (req, res) => {
    const { email, total } = req.body;

    try {
        // Perform checkout process (example: save order details, update inventory, etc.)

        // Send thank you email to the customer
        const { message, info } = await sendThankYouEmail({
            to: email,
            subject: 'Thank you for your purchase!',
            text: `Dear customer, thank you for shopping with us. Your total amount is $${total}.`,
        });

        res.json({ message, info });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Failed to complete checkout', error });
    }
});


// Checkout
router.get('/', (req, res) => {
    res.render('checkout', { title: 'Checkout', cart: req.session.cart || [] });
});

// Complete checkout
router.post('/', async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const user = req.session.user;

        const newOrder = new Order({
            user: user._id,
            products: req.session.cart.map(item => ({ product: item._id, quantity: item.quantity })),
            totalAmount: req.session.cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
            paymentStatus: 'Pending'
        });

        const savedOrder = await newOrder.save();
        req.session.cart = [];

        res.redirect(`/api/checkout/payment?orderId=${savedOrder._id}&paymentMethod=${paymentMethod}`);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Payment page
router.get('/payment', (req, res) => {
    const { orderId, paymentMethod } = req.query;
    res.render('payment', { title: 'Payment', orderId, paymentMethod });
});

// Simulate payment and update order status
router.post('/payment', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'Completed';
        await order.save();

        // Send thank you email with invoice
        sendThankYouEmail(order);

        res.render('thankyou', { title: 'Thank You', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

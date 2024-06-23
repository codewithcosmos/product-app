// checkout.mjs

import { Router } from 'express';
import { findById } from '../models/Order.mjs';

const router = Router();

// Route to get an order by ID
router.get('/:id', async (req, res) => {
    try {
        const orderId = req.params.id; // Extract the order ID from the request parameters
        const order = await findById(orderId); // Call the findById function to fetch the order

        if (!order) { // If no order found, return 404 Not Found
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order); // Return the found order as JSON response
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;

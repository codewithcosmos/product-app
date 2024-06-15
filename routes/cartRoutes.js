// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Assuming you have some middleware to authenticate the user
const authenticateUser = (req, res, next) => {
    // Dummy authentication middleware
    req.user = { id: 'dummyUserId' }; // Replace with actual user id from your authentication logic
    next();
};

router.use(authenticateUser);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);

module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/add/:productId', cartController.addToCart);

module.exports = router;

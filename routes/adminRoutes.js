const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authAdmin } = require('../middleware/auth');

// Admin authentication
router.post('/login', adminController.login);
router.post('/signup', adminController.signup);

// Admin controls
router.get('/users', authAdmin, adminController.getAllUsers);
router.post('/quote', authAdmin, adminController.createQuote);
router.post('/invoice', authAdmin, adminController.createInvoice);
router.post('/send-email', authAdmin, adminController.sendEmail);

module.exports = router;

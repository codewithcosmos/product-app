const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const { createInvoicePDF } = require('../utils/pdfGenerator');
const nodemailer = require('nodemailer');

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific invoice
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new invoice
router.post('/', async (req, res) => {
    const { client, items, total } = req.body;
    const newInvoice = new Invoice({
        client,
        items,
        total
    });
    try {
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an invoice
router.put('/:id', async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(updatedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send invoice via email
router.post('/sendEmail', async (req, res) => {
    const { to, subject, text, invoiceId } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        createInvoicePDF(invoice, async (filePath) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
                attachments: [
                    {
                        filename: `invoice-${invoice._id}.pdf`,
                        path: filePath
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error sending email: ${error}`);
                    return res.status(500).json({ message: 'Error sending email', error });
                }
                console.log(`Email sent: ${info.response}`);
                res.json({ message: 'Email sent', info });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
});

// Cart routes

// Display cart
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.json(cart);
});

// Add product to cart
router.post('/cart/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.session.cart = req.session.cart || [];
        req.session.cart.push(product);
        res.json(req.session.cart); // Return the updated cart
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove product from cart
router.post('/cart/remove/:productId', (req, res) => {
    const productId = req.params.productId;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id.toString() !== productId);
    }
    res.json(req.session.cart); // Return the updated cart
});

module.exports = router;

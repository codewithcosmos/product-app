const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const nodemailer = require('nodemailer');
const { createQuotePDF } = require('../utils/pdfGenerator'); // Assume you have a similar function for quotes

// Get all quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific quote
router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.json(quote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new quote
router.post('/', async (req, res) => {
    const { client, description, amount } = req.body;
    const newQuote = new Quote({
        client,
        description,
        amount
    });
    try {
        const savedQuote = await newQuote.save();
        res.status(201).json(savedQuote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing quote
router.put('/:id', async (req, res) => {
    try {
        const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.json(updatedQuote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a quote
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
        if (!deletedQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.json({ message: 'Quote deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send quote via email
router.post('/sendEmail', async (req, res) => {
    const { to, subject, text, quoteId } = req.body;

    try {
        const quote = await Quote.findById(quoteId);
        if (!quote) return res.status(404).json({ message: 'Quote not found' });

        createQuotePDF(quote, async (filePath) => {
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
                        filename: `quote-${quote._id}.pdf`,
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

module.exports = router;

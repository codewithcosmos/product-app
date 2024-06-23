// quoteRoutes.mjs

import { Router } from 'express';
import Quote from '../models/Quote.mjs'; // Assuming Quote model is exported as default from Quote.mjs
import { createTransport } from 'nodemailer';
import { createQuotePDF } from '../utils/pdfGenerator.mjs';
import { sendEmailWithAttachment } from '../utils/email.mjs';

const router = Router();

// Route to create a new quote
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

// Route to send quote via email
router.post('/sendEmail', async (req, res) => {
    const { to, subject, text, quoteId } = req.body;

    try {
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        const { message, info } = await sendEmailWithAttachment({
            to,
            subject,
            text,
            attachmentType: 'quote',
            data: quote
        });

        res.json({ message, info });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
});

// Route to get all quotes
router.get('/', async (_req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get a specific quote by ID
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

// Route to create a new quote
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

// Route to update an existing quote by ID
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

// Route to delete a quote by ID
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

// Route to send quote via email
router.post('/sendEmail', async (req, res) => {
    const { to, subject, text, quoteId } = req.body;

    try {
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }

        const pdfPath = await createQuotePDF(quote);

        // Send email with quote PDF attachment
        const transporter = createTransport({
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
                    path: pdfPath
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

    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
});

// Export the router
export default router;

// routes/invoiceRoutes.mjs

import { Router } from 'express';
import { createTransport } from 'nodemailer';
import { createInvoicePDF } from '../utils/pdfGenerator.mjs';
import Invoice from '../models/Invoice.mjs'; // Importing default export

const router = Router();

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

// Export the router
export default router;

const User = require('../models/User');
const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { createInvoicePDF } = require('../utils/pdfGenerator');

const jwtSecret = 'your_jwt_secret';

// Admin login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
};

// Admin signup
exports.signup = async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching users', error: err });
    }
};

// Create quote
exports.createQuote = async (req, res) => {
    const { client, description, amount } = req.body;
    try {
        const newQuote = new Quote({ client, description, amount });
        await newQuote.save();
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(400).json({ message: 'Error creating quote', error: err });
    }
};

// Create invoice
exports.createInvoice = async (req, res) => {
    const { client, items, total } = req.body;
    try {
        const newInvoice = new Invoice({ client, items, total });
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(400).json({ message: 'Error creating invoice', error: err });
    }
};

// Send email with PDF attachment
exports.sendEmail = async (req, res) => {
    const { to, subject, text, invoiceId } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        createInvoicePDF(invoice, (filePath) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
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
};

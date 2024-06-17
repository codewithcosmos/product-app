const nodemailer = require('nodemailer');
const { createInvoicePDF } = require('./pdfGenerator');
const User = require('../models/User');
const Order = require('../models/Order');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendThankYouEmail = async (order) => {
    const user = await User.findById(order.user);
    const pdfDoc = createInvoicePDF(order);

    const buffers = [];
    pdfDoc.on('data', buffers.push.bind(buffers));
    pdfDoc.on('end', () => {
        const pdfData = Buffer.concat(buffers);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Thank you for your order!',
            text: 'Thank you for your purchase. Attached is your invoice.',
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfData
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`Error sending email: ${error}`);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
    });
};

module.exports = { sendThankYouEmail };

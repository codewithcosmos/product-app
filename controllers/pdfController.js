// controllers/pdfController.js
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { createTransport } from 'nodemailer';
require('dotenv').config();

const generateInvoicePDF = (invoiceData) => {
    const doc = new PDFDocument();
    const filePath = join(__dirname, '..', 'invoices', `invoice_${invoiceData.id}.pdf`);

    doc.pipe(createWriteStream(filePath));

    doc.fontSize(25).text('Invoice', { align: 'center' });

    doc.fontSize(16).text(`Invoice ID: ${invoiceData.id}`, 50, 100);
    doc.text(`Date: ${invoiceData.date}`, 50, 120);
    doc.text(`Customer Name: ${invoiceData.customerName}`, 50, 140);
    doc.text(`Total Amount: $${invoiceData.totalAmount}`, 50, 160);

    doc.text('Items:', 50, 200);
    invoiceData.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name} - $${item.price}`, 50, 220 + index * 20);
    });

    doc.end();

    return filePath;
};

const sendEmailWithAttachment = async (to, subject, text, attachmentPath) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                path: attachmentPath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

export function generateInvoice(req, res) {
    const invoiceData = req.body;
    const filePath = generateInvoicePDF(invoiceData);
    res.json({ message: 'Invoice generated', filePath });
}

export async function sendInvoice(req, res) {
    const { to, subject, text, invoiceData } = req.body;
    const filePath = generateInvoicePDF(invoiceData);

    try {
        await sendEmailWithAttachment(to, subject, text, filePath);
        res.json({ message: 'Invoice sent via email' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error });
    }
}

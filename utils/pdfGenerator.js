const PDFDocument = require('pdfkit');

exports.createInvoicePDF = (invoice) => {
    const doc = new PDFDocument();

    doc.text(`Invoice for: ${invoice.client}`, { align: 'center' });
    doc.text(`Total: ${invoice.total}`, { align: 'center' });

    invoice.items.forEach(item => {
        doc.text(`${item.description}: $${item.amount}`, { align: 'left' });
    });

    doc.end();

    return doc;
};const PDFDocument = require('pdfkit');

const createInvoicePDF = (order) => {
    const doc = new PDFDocument();

    doc.text(`Invoice for Order #${order._id}`, 50, 50);
    doc.text(`Total Amount: R ${order.totalAmount}`, 50, 80);
    doc.text('Products:', 50, 110);

    order.products.forEach((item, index) => {
        doc.text(`${index + 1}. Product ID: ${item.product} - Quantity: ${item.quantity}`, 50, 140 + (index * 30));
    });

    doc.end();

    return doc;
};

module.exports = { createInvoicePDF };


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
};

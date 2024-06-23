// pdfGenerator.mjs

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Function to generate PDF for quotes
export const createQuotePDF = async (quoteData) => {
    const { client, description, amount } = quoteData;

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Set up fonts and dimensions
        const { width, height } = page.getSize();
        const fontSize = 15;
        const textWidth = page.getFont(StandardFonts.Helvetica).widthOfTextAtSize(client, fontSize);

        // Draw text on the PDF
        page.drawText(client, {
            x: (width - textWidth) / 2,
            y: height - 100,
            size: fontSize,
            font: StandardFonts.Helvetica,
            color: rgb(0, 0, 0),
        });

        page.drawText(description, {
            x: 50,
            y: height - 150,
            size: fontSize,
            font: StandardFonts.Helvetica,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Amount: $${amount}`, {
            x: 50,
            y: height - 200,
            size: fontSize,
            font: StandardFonts.Helvetica,
            color: rgb(0, 0, 0),
        });

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        const pdfPath = path.join(__dirname, `quote-${quoteData._id}.pdf`);
        const pdfStream = createWriteStream(pdfPath);
        pdfStream.write(pdfBytes);
        pdfStream.end();

        return pdfPath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};

// Function to generate PDF for invoices
export const createInvoicePDF = async (invoiceData) => {
    const { client, items, total } = invoiceData;

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Set up fonts and dimensions
        const { width, height } = page.getSize();
        const fontSize = 15;

        // Draw text on the PDF
        page.drawText(`Client: ${client}`, {
            x: 50,
            y: height - 100,
            size: fontSize,
            font: StandardFonts.Helvetica,
            color: rgb(0, 0, 0),
        });

        let y = height - 150;
        items.forEach((item) => {
            page.drawText(`${item.name}: $${item.price}`, {
                x: 50,
                y,
                size: fontSize,
                font: StandardFonts.Helvetica,
                color: rgb(0, 0, 0),
            });
            y -= 20;
        });

        page.drawText(`Total: $${total}`, {
            x: 50,
            y: y - 20,
            size: fontSize,
            font: StandardFonts.Helvetica,
            color: rgb(0, 0, 0),
        });

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        const pdfPath = path.join(__dirname, `invoice-${invoiceData._id}.pdf`);
        const pdfStream = createWriteStream(pdfPath);
        pdfStream.write(pdfBytes);
        pdfStream.end();

        return pdfPath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};

import { PDFDocument, rgb } from 'pdf-lib';

async function createPDF(content) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
    const textSize = 30;
    const textWidth = font.widthOfTextAtSize(content, textSize);
    const textHeight = 50;

    page.drawText(content, {
        x: (page.getWidth() - textWidth) / 2,
        y: page.getHeight() - textHeight - 50,
        size: textSize,
        font: font,
        color: rgb(0, 0, 0),
    });

    return await pdfDoc.save();
}

export { createPDF };

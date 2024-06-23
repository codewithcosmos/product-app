// email.mjs

import { createTransport } from 'nodemailer';

// Function to send a thank you email
export const sendThankYouEmail = async ({ to, subject, text }) => {
    try {
        // Create Nodemailer transporter
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Setup email data
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return { message: 'Email sent', info };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Function to send an email with PDF attachment (assuming createQuotePDF is defined elsewhere)
export const sendEmailWithAttachment = async ({ to, subject, text, attachmentType, data }) => {
    try {
        let pdfPath;

        if (attachmentType === 'quote') {
            pdfPath = await createQuotePDF(data);
        } else if (attachmentType === 'invoice') {
            pdfPath = await createInvoicePDF(data);
        } else {
            throw new Error('Invalid attachment type');
        }

        // Create Nodemailer transporter
        const transporter = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Setup email data with attachment
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: [
                {
                    filename: `${attachmentType}-${data._id}.pdf`,
                    path: pdfPath
                }
            ]
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return { message: 'Email sent', info };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

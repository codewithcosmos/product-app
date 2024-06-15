// utils/email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailWithAttachment = async (to, subject, text, attachmentPath) => {
  const transporter = nodemailer.createTransport({
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

module.exports = {
  sendEmailWithAttachment
};

// routes/pdfRoutes.mjs
import { Router } from 'express';
const router = Router();
import { generateInvoicePDF } from '../controllers/pdfController';
import { sendEmailWithAttachment } from '../utils/email';

router.post('/generate-invoice', async (req, res) => {
  const invoiceData = req.body;
  const filePath = generateInvoicePDF(invoiceData);
  res.json({ message: 'Invoice generated', filePath });
});

router.post('/send-invoice', async (req, res) => {
  const { to, subject, text, invoiceData } = req.body;
  const filePath = generateInvoicePDF(invoiceData);

  try {
    await sendEmailWithAttachment(to, subject, text, filePath);
    res.json({ message: 'Invoice sent via email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

export default router;

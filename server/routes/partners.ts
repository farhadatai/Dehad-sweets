import { Router } from 'express';
import { sendEmail } from '../mailer.js';

const router = Router();

const escapeHtml = (value: unknown) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

router.post('/partners', async (req, res) => {
  const { businessName, contactPerson, email, phoneNumber, location, requestType } = req.body;

  if (!businessName || !contactPerson || !email || !phoneNumber) {
    res.status(400).json({ error: 'Business name, contact, email, and phone are required' });
    return;
  }

  await sendEmail(
    'info@dehatsweets.com',
    `New wholesale partner inquiry: ${businessName}`,
    `
      <h1>New wholesale partner inquiry</h1>
      <p><strong>Business:</strong> ${escapeHtml(businessName)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(contactPerson)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phoneNumber)}</p>
      <p><strong>Location:</strong> ${escapeHtml(location || 'Not provided')}</p>
      <p><strong>Request:</strong> ${escapeHtml(requestType || 'Not provided')}</p>
    `
  );

  res.status(201).json({ message: 'Partner inquiry received' });
});

export default router;

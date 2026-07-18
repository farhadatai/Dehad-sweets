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

// --- Public contact + email-signup endpoints (redesign) -----------------
// Very light in-memory rate limit: max 5 requests per IP per 10 minutes.
const hits = new Map<string, { count: number; ts: number }>();
const rateLimited = (ip: string) => {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > 10 * 60 * 1000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
};

const isEmail = (v: unknown) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

router.post('/contact', async (req, res) => {
  const { name, email, phone, message, company } = req.body || {};

  // Honeypot: real users never fill "company"
  if (company) {
    res.status(201).json({ message: 'Message received' });
    return;
  }
  if (rateLimited(req.ip || 'unknown')) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }
  if (!name || !isEmail(email) || !message) {
    res.status(400).json({ error: 'Name, a valid email, and a message are required' });
    return;
  }

  await sendEmail(
    'info@dehatsweets.com',
    `Website contact from ${escapeHtml(name)}`,
    `
      <h1>New website message</h1>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message)}</p>
    `
  );

  res.status(201).json({ message: 'Message received' });
});

router.post('/subscribe', async (req, res) => {
  const { email, company } = req.body || {};

  if (company) {
    res.status(201).json({ message: 'Subscribed' });
    return;
  }
  if (rateLimited(req.ip || 'unknown')) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ error: 'A valid email is required' });
    return;
  }

  await sendEmail(
    'info@dehatsweets.com',
    'New email signup — Join the Dehat Table',
    `
      <h1>New email list signup</h1>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p>Add this address to the announcement list.</p>
    `
  );

  res.status(201).json({ message: 'Subscribed' });
});

export default router;

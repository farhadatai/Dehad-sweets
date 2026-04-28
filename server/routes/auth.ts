import { Router } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../mailer.js';

const router = Router();

const escapeHtml = (value: unknown) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email }, include: { store: true } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role === 'CUSTOMER' && user.accountStatus !== 'APPROVED') {
      return res.status(403).json({ error: 'Your store account is waiting for management approval.' });
    }

    if (user.role === 'CUSTOMER' && (!user.store || !user.store.isActive)) {
      return res.status(403).json({ error: 'Your store account is not active yet.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, storeId: user.storeId, accountStatus: user.accountStatus },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, storeId: user.storeId } });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register-store', async (req, res) => {
  const { name, email, password, storeName, address, phone, requestType, notes } = req.body;

  if (!name || !email || !password || !storeName || !address || !phone) {
    return res.status(400).json({ error: 'Name, email, password, store name, address, and phone are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingStore = await prisma.store.findUnique({ where: { email } });

    if (existingUser || existingStore) {
      return res.status(409).json({ error: 'An account or store with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name: storeName,
          owner: name,
          phone,
          address,
          email,
          notes: `${requestType || 'Wholesale store account'}${notes ? ` - ${notes}` : ''}`,
          isActive: false,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          storeName,
          storeId: store.id,
          address,
          phone,
          role: 'CUSTOMER',
          accountStatus: 'PENDING',
        },
      });

      return { store, user };
    });

    await sendEmail(
      'info@dehatsweets.com',
      `New partner account request: ${storeName}`,
      `
        <h1>New partner account request</h1>
        <p><strong>Store:</strong> ${escapeHtml(storeName)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Address:</strong> ${escapeHtml(address)}</p>
        <p><strong>Request:</strong> ${escapeHtml(requestType || 'Wholesale store account')}</p>
        <p><strong>Notes:</strong> ${escapeHtml(notes || 'None')}</p>
      `
    );

    res.status(201).json({
      message: 'Partner account request received. Management will approve the account before online ordering is enabled.',
      storeId: result.store.id,
      userId: result.user.id,
    });
  } catch (error) {
    console.error('Store registration failed:', error);
    res.status(400).json({ error: 'Failed to create store account request' });
  }
});

export default router;

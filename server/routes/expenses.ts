
import { Router } from 'express';
import prisma from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const uploadRoot = process.env.VERCEL ? '/tmp/uploads' : path.join(process.cwd(), 'uploads');
const receiptUploadDir = path.join(uploadRoot, 'receipts');
fs.mkdirSync(receiptUploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, receiptUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Create a new expense
router.post('/expenses', upload.single('receipt'), async (req, res) => {
  const { item, category, amount, date } = req.body;
  const receipt = req.file ? req.file.path : null;
  try {
    const expense = await prisma.expense.create({
      data: { item, category, amount: parseFloat(amount), date: new Date(date), receipt },
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create expense' });
  }
});

// Get all expenses
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Update an expense
router.patch('/expenses/:id', upload.single('receipt'), async (req, res) => {
  const { id } = req.params;
  const { item, category, amount, date } = req.body;
  const receipt = req.file ? req.file.path : undefined;

  try {
    const expense = await prisma.expense.update({
      where: { id },
      data: { 
        item,
        category,
        amount: parseFloat(amount),
        date: new Date(date),
        ...(receipt && { receipt }),
       },
    });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update expense' });
  }
});

export default router;

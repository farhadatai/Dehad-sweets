
import { Router } from 'express';
import prisma from '../db.js';

const router = Router();

// Create a new product
router.post('/products', async (req, res) => {
  const { name, category, boxSize, unitsPerCase, costPerBox, wholesalePricePerBox } = req.body;
  try {
    const product = await prisma.product.create({
      data: { name, category, boxSize, unitsPerCase, costPerBox, wholesalePricePerBox },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update a product
router.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, boxSize, unitsPerCase, costPerBox, wholesalePricePerBox } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id },
            data: { name, category, boxSize, unitsPerCase, costPerBox, wholesalePricePerBox },
        });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update product' });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete product' });
    }
});

export default router;

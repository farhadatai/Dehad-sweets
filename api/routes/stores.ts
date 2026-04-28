
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Create a new store
router.post('/stores', async (req, res) => {
  const { name, owner, phone, address, email, notes } = req.body;
  try {
    const store = await prisma.store.create({
      data: { name, owner, phone, address, email, notes },
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create store' });
  }
});

// Get all stores
router.get('/stores', async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        users: {
          where: { role: 'CUSTOMER' },
          select: { id: true, name: true, email: true, accountStatus: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

router.patch('/stores/:id/approval', async (req, res) => {
  const { id } = req.params;
  const { accountStatus } = req.body;

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(accountStatus)) {
    res.status(400).json({ error: 'Valid account status is required' });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const store = await tx.store.update({
        where: { id },
        data: { isActive: accountStatus === 'APPROVED' },
      });

      await tx.user.updateMany({
        where: { storeId: id, role: 'CUSTOMER' },
        data: { accountStatus },
      });

      return store;
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update store approval' });
  }
});

// Update a store
router.patch('/stores/:id', async (req, res) => {
    const { id } = req.params;
    const { name, owner, phone, address, email, notes } = req.body;
    try {
        const store = await prisma.store.update({
            where: { id },
            data: { name, owner, phone, address, email, notes },
        });
        res.json(store);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update store' });
    }
});

// Delete a store
router.delete('/stores/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.store.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete store' });
    }
});

export default router;

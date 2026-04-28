import { Router } from 'express';
import prisma from '../db';

const router = Router();

// manual inventory adjustment
router.patch('/inventory/:productId', async (req, res) => {
  const { productId } = req.params;
  const { inventory, quantity, reason } = req.body;
  const nextInventory = Number(inventory ?? quantity);

  if (!Number.isInteger(nextInventory) || nextInventory < 0) {
    res.status(400).json({ error: 'Inventory must be a non-negative whole number' });
    return;
  }

  try {
    const product = await prisma.$transaction(async (tx) => {
      const currentProduct = await tx.product.findUnique({
        where: { id: productId },
        select: { inventory: true },
      });

      if (!currentProduct) {
        throw new Error('PRODUCT_NOT_FOUND');
      }

      const inventoryBefore = currentProduct.inventory;
      const delta = nextInventory - inventoryBefore;

      const product = await tx.product.update({
        where: { id: productId },
        data: { inventory: nextInventory },
      });

      await tx.inventoryLog.create({
        data: {
          productId,
          quantity: delta,
          inventoryBefore,
          inventoryAfter: nextInventory,
          reason: reason || 'manual_adjustment',
        },
      });

      return product;
    });

    res.json(product);
  } catch (error) {
    if (error instanceof Error && error.message === 'PRODUCT_NOT_FOUND') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(500).json({ error: 'Failed to adjust inventory' });
  }
});

export default router;

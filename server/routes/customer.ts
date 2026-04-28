import { Router } from 'express';
import { Request } from 'express';
import prisma from '../db.js';

const router = Router();

interface AuthRequest extends Request {
  user?: { id?: string; role?: string; storeId?: string };
}

router.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user?.id },
      include: { store: true, product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch store orders' });
  }
});

router.post('/orders', async (req: AuthRequest, res) => {
  const { productId, quantity, deliveryDate, notes } = req.body;
  const parsedQuantity = Number(quantity);

  if (!productId || !parsedQuantity || parsedQuantity < 1 || !deliveryDate) {
    res.status(400).json({ error: 'Product, quantity, and delivery date are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { store: true },
    });

    if (!user || user.role !== 'CUSTOMER' || user.accountStatus !== 'APPROVED' || !user.storeId || !user.store?.isActive) {
      res.status(403).json({ error: 'Store account is not approved for online ordering' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product || !product.isActive) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const pricePerBox = product.wholesalePricePerBox;
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        storeId: user.storeId,
        productId,
        quantity: parsedQuantity,
        pricePerBox,
        totalPrice: parsedQuantity * pricePerBox,
        deliveryDate: new Date(deliveryDate),
        notes,
      },
      include: { store: true, product: true },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to place online order' });
  }
});

export default router;

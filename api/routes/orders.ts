
import { Router } from 'express';
import prisma from '../db';
import { sendEmail } from '../mailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const invoiceUploadDir = path.join(process.cwd(), 'uploads', 'invoices');
fs.mkdirSync(invoiceUploadDir, { recursive: true });

const invoiceUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, invoiceUploadDir);
    },
    filename: (_req, file, cb) => {
      cb(null, `signed-invoice-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

// Create a new order
router.post('/orders', async (req, res) => {
  const { userId, storeId, productId, quantity, pricePerBox, deliveryDate, notes } = req.body;
  try {
    const totalPrice = quantity * pricePerBox;
    const order = await prisma.order.create({
      data: {
        userId,
        storeId,
        productId,
        quantity,
        pricePerBox,
        totalPrice,
        deliveryDate: new Date(deliveryDate),
        notes,
      },
      include: { user: true },
    });

    if (order.user) {
        // Send order confirmation email
        await sendEmail(
          order.user.email,
          `Your Dehat Sweets and Foods Order #${order.id} is Confirmed`,
          `<h1>Thank you for your order!</h1><p>Your order #${order.id} has been confirmed. You can view your order details at <a href="https://www.dehatsweets.com/orders">www.dehatsweets.com/orders</a>.</p>`
        );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { store: true, product: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const nextOrderStatus = req.body.orderStatus ?? req.body.status;

  if (!nextOrderStatus) {
    res.status(400).json({ error: 'Order status is required' });
    return;
  }

  try {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!existingOrder) {
        throw new Error('ORDER_NOT_FOUND');
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { orderStatus: nextOrderStatus },
        include: { product: true },
      });

      if (nextOrderStatus === 'delivered' && existingOrder.orderStatus !== 'delivered') {
        const inventoryBefore = existingOrder.product.inventory;
        const inventoryAfter = inventoryBefore - updatedOrder.quantity;

        await tx.product.update({
          where: { id: updatedOrder.productId },
          data: { inventory: inventoryAfter },
        });

        await tx.inventoryLog.create({
          data: {
            productId: updatedOrder.productId,
            orderId: updatedOrder.id,
            quantity: -updatedOrder.quantity,
            inventoryBefore,
            inventoryAfter,
            reason: 'order_fulfillment',
          },
        });
      }

      return updatedOrder;
    });

    res.json(updatedOrder);
  } catch (error) {
    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(400).json({ error: 'Failed to update order status' });
  }
});

// Update an order
router.patch('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { storeId, productId, quantity, pricePerBox, deliveryDate, notes, paymentStatus, orderStatus, deliveredBy, receiverName } = req.body;
    try {
        const totalPrice = quantity * pricePerBox;
        const order = await prisma.order.update({
            where: { id },
            data: { storeId, productId, quantity, pricePerBox, totalPrice, deliveryDate: new Date(deliveryDate), notes, paymentStatus, orderStatus, deliveredBy, receiverName },
        });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
});

router.patch('/orders/:id/delivery', invoiceUpload.single('deliveryInvoice'), async (req, res) => {
  const { id } = req.params;
  const { deliveredBy, receiverName } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        deliveredBy: deliveredBy || undefined,
        receiverName: receiverName || undefined,
        deliveryInvoice: req.file ? `/uploads/invoices/${req.file.filename}` : undefined,
      },
      include: { store: true, product: true },
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to upload signed invoice' });
  }
});

// Delete an order
router.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.order.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete order' });
    }
});

router.get('/orders/pending', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderStatus: 'pending'
      },
      include: {
        store: true,
        product: true,
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
});

export default router;

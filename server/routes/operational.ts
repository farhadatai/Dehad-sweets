import { Router } from 'express';
import prisma from '../db.js';
import { adjustDailyGoal } from '../logic/goal-adjustment.js';

const router = Router();

router.get('/operational/summary', async (_req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [employees, stores, products, activeOrders, readyOrders, productionGoal, completedOrders] = await Promise.all([
      prisma.employee.findMany({
        where: { role: { not: 'ADMIN' } },
        select: { id: true, name: true, role: true },
        orderBy: { name: 'asc' },
      }),
      prisma.store.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      }),
      prisma.order.findMany({
        where: { orderStatus: { in: ['pending', 'in_production'] } },
        include: { store: true, product: true },
        orderBy: { deliveryDate: 'asc' },
      }),
      prisma.order.findMany({
        where: { orderStatus: 'ready' },
        include: { store: true, product: true },
        orderBy: { deliveryDate: 'asc' },
      }),
      prisma.productionGoal.findUnique({
        where: { month_year: { month: now.getMonth() + 1, year: now.getFullYear() } },
      }),
      prisma.order.aggregate({
        where: {
          orderStatus: { in: ['ready', 'delivered'] },
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { quantity: true },
      }),
    ]);

    const dailyGoal = await adjustDailyGoal(500);
    const monthlyGoal = productionGoal?.goal || 5000;
    const totalBoxesForGoal = completedOrders._sum.quantity || 0;
    const boxesRemaining = Math.max(monthlyGoal - totalBoxesForGoal, 0);
    const daysRemaining = Math.max(endOfMonth.getDate() - now.getDate(), 1);
    const requiredDailyAverage = Math.ceil(boxesRemaining / daysRemaining);

    const productionTasks = activeOrders.reduce((acc, order) => {
      const existingProduct = acc.find(p => p.productId === order.productId);
      if (existingProduct) {
        existingProduct.totalBoxesNeeded += order.quantity;
        existingProduct.boxesToBake = Math.max(existingProduct.totalBoxesNeeded - order.product.inventory, 0);
        existingProduct.piecesToBake = existingProduct.boxesToBake * order.product.unitsPerCase;
        existingProduct.orderCount += 1;
        existingProduct.orderIds.push(order.id);
        existingProduct.status = existingProduct.status === 'in_production' || order.orderStatus === 'in_production'
          ? 'in_production'
          : 'pending';
      } else {
        const boxesToBake = Math.max(order.quantity - order.product.inventory, 0);
        acc.push({
          productId: order.productId,
          productName: order.product.name,
          boxSize: order.product.boxSize,
          unitsPerCase: order.product.unitsPerCase,
          inventoryOnHand: order.product.inventory,
          totalBoxesNeeded: order.quantity,
          boxesToBake,
          piecesToBake: boxesToBake * order.product.unitsPerCase,
          orderCount: 1,
          orderIds: [order.id],
          status: order.orderStatus,
        });
      }
      return acc;
    }, []);

    res.json({
      goals: {
        daily: dailyGoal,
        monthly: monthlyGoal,
        totalBoxesForGoal,
        boxesRemaining,
        requiredDailyAverage,
      },
      employees,
      stores,
      products,
      pendingOrders: activeOrders,
      readyOrders,
      productionTasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operational dashboard' });
  }
});

router.post('/operational/clock', async (req, res) => {
  const { employeeId, pin } = req.body;

  if (!employeeId || !pin) {
    res.status(400).json({ error: 'Employee and PIN are required' });
    return;
  }

  try {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });

    if (!employee || employee.pin !== pin) {
      res.status(401).json({ error: 'Invalid employee or PIN' });
      return;
    }

    const lastTimeLog = await prisma.timeLog.findFirst({
      where: { employeeId },
      orderBy: { clockIn: 'desc' },
    });

    if (lastTimeLog && !lastTimeLog.clockOut) {
      const clockOut = new Date();
      const totalHours = (clockOut.getTime() - lastTimeLog.clockIn.getTime()) / (1000 * 60 * 60);
      const timeLog = await prisma.timeLog.update({
        where: { id: lastTimeLog.id },
        data: { clockOut, totalHours },
      });

      res.json({ status: 'Clocked Out', employeeName: employee.name, timeLog });
      return;
    }

    const timeLog = await prisma.timeLog.create({
      data: { employeeId, clockIn: new Date() },
    });

    res.json({ status: 'Clocked In', employeeName: employee.name, timeLog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock in/out' });
  }
});

router.patch('/operational/inventory/:productId', async (req, res) => {
  const { productId } = req.params;
  const nextInventory = Number(req.body.inventory);
  const reason = req.body.reason || 'tablet_inventory_count';

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
          reason,
        },
      });

      return product;
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update inventory count' });
  }
});

router.post('/operational/orders', async (req, res) => {
  const { storeId, productId, quantity, deliveryDate, notes } = req.body;
  const orderQuantity = Number(quantity);

  if (!storeId || !productId || !Number.isInteger(orderQuantity) || orderQuantity <= 0 || !deliveryDate) {
    res.status(400).json({ error: 'Store, product, quantity, and delivery date are required' });
    return;
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const order = await prisma.order.create({
      data: {
        storeId,
        productId,
        quantity: orderQuantity,
        pricePerBox: product.wholesalePricePerBox,
        totalPrice: orderQuantity * product.wholesalePricePerBox,
        deliveryDate: new Date(deliveryDate),
        notes,
      },
      include: { store: true, product: true },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

router.patch('/operational/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { orderStatus, deliveredBy } = req.body;

  if (!['in_production', 'ready', 'delivered'].includes(orderStatus)) {
    res.status(400).json({ error: 'Operational users can only start, ready, or deliver orders' });
    return;
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!existingOrder) {
        throw new Error('ORDER_NOT_FOUND');
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          orderStatus,
          deliveredBy: deliveredBy || undefined,
        },
        include: { store: true, product: true },
      });

      if (orderStatus === 'delivered' && existingOrder.orderStatus !== 'delivered') {
        const inventoryBefore = existingOrder.product.inventory;
        const inventoryAfter = inventoryBefore - existingOrder.quantity;

        await tx.product.update({
          where: { id: existingOrder.productId },
          data: { inventory: inventoryAfter },
        });

        await tx.inventoryLog.create({
          data: {
            productId: existingOrder.productId,
            orderId: existingOrder.id,
            quantity: -existingOrder.quantity,
            inventoryBefore,
            inventoryAfter,
            reason: 'order_fulfillment',
          },
        });
      }

      return updatedOrder;
    });

    res.json(order);
  } catch (error) {
    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(400).json({ error: 'Failed to update order status' });
  }
});

export default router;

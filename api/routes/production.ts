
import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/production', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const productionGoal = await prisma.productionGoal.findUnique({
        where: { month_year: { month: now.getMonth() + 1, year: now.getFullYear() } },
    });

    const monthlyGoal = productionGoal ? productionGoal.goal : 5000;

    const completedOrders = await prisma.order.aggregate({
      where: {
        orderStatus: { in: ['ready', 'delivered'] },
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { quantity: true },
    });

    const totalBoxesForGoal = completedOrders._sum.quantity || 0;

    const pendingOrders = await prisma.order.findMany({
      where: {
        orderStatus: { in: ['pending', 'in_production'] },
      },
      include: { product: true, store: true },
      orderBy: { deliveryDate: 'asc' },
    });

    const dailyBakingList = pendingOrders.reduce((acc, order) => {
      const existingProduct = acc.find(p => p.productId === order.productId);
      if (existingProduct) {
        existingProduct.totalBoxesNeeded += order.quantity;
        existingProduct.boxesToBake = Math.max(existingProduct.totalBoxesNeeded - order.product.inventory, 0);
        existingProduct.piecesToBake = existingProduct.boxesToBake * order.product.unitsPerCase;
        existingProduct.orderCount += 1;
        existingProduct.orders.push({
          id: order.id,
          storeName: order.store.name,
          quantity: order.quantity,
          status: order.orderStatus,
          deliveryDate: order.deliveryDate,
        });
        existingProduct.status = existingProduct.orders.some(o => o.status === 'in_production')
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
          status: order.orderStatus,
          orders: [{
            id: order.id,
            storeName: order.store.name,
            quantity: order.quantity,
            status: order.orderStatus,
            deliveryDate: order.deliveryDate,
          }],
        });
      }
      return acc;
    }, []);

    const boxesRemaining = monthlyGoal - totalBoxesForGoal;
    const daysRemaining = endOfMonth.getDate() - now.getDate();
    const requiredDailyAverage = daysRemaining > 0 ? boxesRemaining / daysRemaining : 0;

    res.json({
      totalBoxesForGoal,
      dailyBakingList,
      boxesRemaining,
      requiredDailyAverage: requiredDailyAverage > 0 ? requiredDailyAverage.toFixed(2) : 0,
      monthlyGoal,
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch production data' });
  }
});

router.post('/production/goal', async (req, res) => {
    const { month, year, goal } = req.body;
    try {
        const productionGoal = await prisma.productionGoal.upsert({
            where: { month_year: { month, year } },
            update: { goal },
            create: { month, year, goal },
        });
        res.status(201).json(productionGoal);
    } catch (error) {
        res.status(400).json({ error: 'Failed to set production goal' });
    }
});

export default router;

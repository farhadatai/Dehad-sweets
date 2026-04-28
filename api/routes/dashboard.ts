
import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalBoxesOrdered = await prisma.order.aggregate({
      _sum: { quantity: true },
    });

    const deliveredOrders = await prisma.order.findMany({
        where: { orderStatus: 'delivered' },
        include: { product: true },
    });

    const totalRevenue = deliveredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalCOGS = deliveredOrders.reduce((acc, order) => acc + (order.quantity * order.product.costPerBox), 0);

    const activeStores = await prisma.store.count({
      where: { isActive: true },
    });

    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    const employees = await prisma.employee.findMany({
      include: {
        timeLogs: {
          where: { clockOut: { not: null } },
        },
      },
    });

    const totalPayroll = employees.reduce((acc, employee) => {
      const totalHours = employee.timeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
      return acc + (totalHours * employee.hourlyRate);
    }, 0);

    const netProfit = totalRevenue - (totalExpenses._sum.amount || 0) - totalPayroll - totalCOGS;

    res.json({
      totalBoxesOrdered: totalBoxesOrdered._sum.quantity || 0,
      totalRevenue: totalRevenue,
      activeStores,
      netProfit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

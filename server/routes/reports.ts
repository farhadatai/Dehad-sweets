
import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/reports/monthly/:year/:month', async (req, res) => {
  const year = parseInt(req.params.year, 10);
  const month = parseInt(req.params.month, 10);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    res.status(400).json({ error: 'Valid year and month are required' });
    return;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  try {
    const [orders, expenses, employees] = await Promise.all([
      prisma.order.findMany({
        where: {
          deliveryDate: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: { store: true, product: true },
        orderBy: { deliveryDate: 'asc' },
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.employee.findMany({
        include: {
          timeLogs: {
            where: {
              clockIn: {
                gte: startDate,
                lt: endDate,
              },
              clockOut: { not: null },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    const deliveredOrders = orders.filter(order => order.orderStatus === 'delivered');
    const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
    const unpaidOrders = orders.filter(order => order.paymentStatus !== 'paid');

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const paidRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const unpaidRevenue = unpaidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalBoxesDelivered = deliveredOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalCogs = deliveredOrders.reduce((sum, order) => sum + (order.quantity * order.product.costPerBox), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const laborTotals = employees.map(employee => {
      const totalHours = employee.timeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        role: employee.role,
        totalHours,
        totalPay: totalHours * employee.hourlyRate,
      };
    }).filter(employee => employee.totalHours > 0);

    const totalLaborHours = laborTotals.reduce((sum, employee) => sum + employee.totalHours, 0);
    const totalLaborCost = laborTotals.reduce((sum, employee) => sum + employee.totalPay, 0);

    res.json({
      month,
      year,
      summary: {
        totalOrders: orders.length,
        deliveredOrders: deliveredOrders.length,
        paidOrders: paidOrders.length,
        unpaidOrders: unpaidOrders.length,
        totalBoxesDelivered,
        totalRevenue,
        paidRevenue,
        unpaidRevenue,
        totalCogs,
        totalLaborHours,
        totalLaborCost,
        totalExpenses,
        netProfit: totalRevenue - totalCogs - totalLaborCost - totalExpenses,
      },
      orders: orders.map(order => ({
        id: order.id,
        storeName: order.store.name,
        productName: order.product.name,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        deliveryDate: order.deliveryDate,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      })),
      expenses,
      laborTotals,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly report' });
  }
});

router.get('/reports/:year/:month', async (req, res) => {
  const { year, month } = req.params;

  try {
    const historicalRecord = await prisma.historicalRecord.findUnique({
      where: {
        month_year: {
          month: parseInt(month),
          year: parseInt(year),
        },
      },
    });

    if (!historicalRecord) {
      return res.status(404).json({ error: 'No historical record found for this month' });
    }

    // Fetch detailed data for the report
    const expenses = await prisma.expense.findMany({
        where: {
            date: {
                gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                lt: new Date(parseInt(year), parseInt(month), 1),
            }
        }
    });

    const employees = await prisma.employee.findMany({
        include: {
            timeLogs: {
                where: {
                    clockIn: {
                        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                        lt: new Date(parseInt(year), parseInt(month), 1),
                    },
                    clockOut: { not: null }
                }
            }
        }
    });

    const laborTotals = employees.map(e => ({
        name: e.name,
        totalHours: e.timeLogs.reduce((acc, log) => acc + (log.totalHours || 0), 0),
        totalPay: e.timeLogs.reduce((acc, log) => acc + (log.totalHours || 0), 0) * e.hourlyRate
    }));


    res.json({ historicalRecord, expenses, laborTotals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

export default router;

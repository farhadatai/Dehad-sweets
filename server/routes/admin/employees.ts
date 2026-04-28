import { Router } from 'express';
import prisma from '../../db.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Create a new employee
router.post('/', async (req, res) => {
  const { name, email, password, role, hourlyRate } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.create({
      data: { name, email, password: hashedPassword, role, hourlyRate },
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee' });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get all time logs
router.get('/timelogs', async (req, res) => {
  try {
    const timeLogs = await prisma.timeLog.findMany({
      include: { employee: true },
    });
    res.json(timeLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch time logs' });
  }
});

// Get payroll summary
router.get('/payroll', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        timeLogs: {
          where: { clockOut: { not: null } },
        },
      },
    });

    const payrollSummary = employees.map(employee => {
      const totalHours = employee.timeLogs.reduce((acc, log) => acc + (log.totalHours || 0), 0);
      const totalPay = totalHours * (employee.hourlyRate || 0);
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        totalHours,
        totalPay,
      };
    });

    res.json(payrollSummary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll summary' });
  }
});

// Update an employee
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, pin, role, hourlyRate } = req.body;
    try {
        const employee = await prisma.employee.update({
            where: { id },
            data: { name, pin, role, hourlyRate },
        });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update employee' });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.employee.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete employee' });
    }
});

// Get paystub data
router.get('/:id/paystub', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        timeLogs: {
          where: { clockOut: { not: null } },
          orderBy: { clockIn: 'asc' },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (employee.timeLogs.length === 0) {
        return res.status(404).json({ error: 'No time logs found for this employee' });
    }

    const payPeriodStart = employee.timeLogs[0].clockIn;
    const payPeriodEnd = employee.timeLogs[employee.timeLogs.length - 1].clockIn;

    const earnings = employee.timeLogs.map(log => ({
      description: `Regular Hours - ${new Date(log.clockIn).toLocaleDateString()}`,
      rate: employee.hourlyRate || 0,
      hours: log.totalHours || 0,
      total: (log.totalHours || 0) * (employee.hourlyRate || 0),
    }));

    const totalPay = earnings.reduce((acc, earning) => acc + earning.total, 0);

    res.json({
      employee: {
        name: employee.name,
        role: employee.role,
      },
      payPeriodStart,
      payPeriodEnd,
      earnings,
      totalPay,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch paystub data' });
  }
});

export default router;

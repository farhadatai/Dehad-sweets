import { Router } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Get all employees
router.get('/admin/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Create new employee
router.post('/admin/employees', async (req, res) => {
  const { name, role, hourlyRate, pin } = req.body;
  try {
    const newEmployee = await prisma.employee.create({
      data: {
        ...req.body,
        password: await bcrypt.hash(pin, 10)
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Get all time logs
router.get('/admin/employees/timelogs', async (req, res) => {
    try {
        const timeLogs = await prisma.timeLog.findMany({
            include: {
                employee: true,
            },
            orderBy: {
                clockIn: 'desc',
            },
        });
        res.json(timeLogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch time logs' });
    }
});

// Get payroll
router.get('/admin/employees/payroll', async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                timeLogs: {
                    where: {
                        clockOut: { not: null },
                    },
                },
            },
        });

        const payroll = employees.map(employee => {
            const totalHours = employee.timeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
            const totalPay = totalHours * employee.hourlyRate;
            return {
                employeeId: employee.id,
                employeeName: employee.name,
                totalHours,
                totalPay,
            };
        });

        res.json(payroll);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payroll' });
    }
});

// Get paystub
router.get('/admin/employees/:id/paystub', async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                timeLogs: {
                    where: {
                        clockOut: { not: null },
                    },
                },
            },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const totalHours = employee.timeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
        const totalPay = totalHours * employee.hourlyRate;

        res.json({
            employee,
            totalHours,
            totalPay,
            timeLogs: employee.timeLogs,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paystub' });
    }
});

// Get time logs for a specific employee
router.get('/admin/employees/:id/timelogs', async (req, res) => {
    const { id } = req.params;
    try {
        const timeLogs = await prisma.timeLog.findMany({
            where: { employeeId: id },
            include: {
                employee: true,
            },
            orderBy: {
                clockIn: 'desc',
            },
        });
        res.json(timeLogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch time logs for employee' });
    }
});

// Update a time log
router.patch('/admin/employees/timelogs/:id', async (req, res) => {
    const { id } = req.params;
    const { clockIn, clockOut } = req.body;

    try {
        const updatedTimeLog = await prisma.timeLog.update({
            where: { id },
            data: {
                clockIn: new Date(clockIn),
                clockOut: new Date(clockOut),
            },
        });
        res.json(updatedTimeLog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update time log' });
    }
});



// Update an employee
router.patch('/admin/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: req.body,
        });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete an employee
router.delete('/admin/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.employee.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});


// Employee Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

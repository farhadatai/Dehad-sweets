import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Clock in/out
router.post('/employees/clock', async (req, res) => {
  const { employeeId, pin } = req.body;
  try {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee || employee.pin !== pin) {
      return res.status(401).json({ error: 'Invalid employee or PIN' });
    }

    const lastTimeLog = await prisma.timeLog.findFirst({
      where: { employeeId },
      orderBy: { clockIn: 'desc' },
    });

    if (lastTimeLog && !lastTimeLog.clockOut) {
      // Clock out
      const clockOut = new Date();
      const totalHours = (clockOut.getTime() - lastTimeLog.clockIn.getTime()) / (1000 * 60 * 60);
      const updatedTimeLog = await prisma.timeLog.update({
        where: { id: lastTimeLog.id },
        data: { clockOut, totalHours },
      });
      res.json({ status: 'Clocked Out', timeLog: updatedTimeLog });
    } else {
      // Clock in
      const newTimeLog = await prisma.timeLog.create({
        data: { employeeId, clockIn: new Date() },
      });
      res.json({ status: 'Clocked In', timeLog: newTimeLog });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock in/out' });
  }
});

export default router;

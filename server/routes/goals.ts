import { Router } from 'express';
import prisma from '../db';

import { adjustDailyGoal } from '../logic/goal-adjustment';

const router = Router();

router.get('/goals', async (req, res) => {
  try {
    // For now, we'll return a static monthly goal. This can be updated to fetch from the database.
    const monthlyGoal = 5000;
    const dailyGoal = 500;

    const adjustedDailyGoal = await adjustDailyGoal(dailyGoal);

    const goals = {
      daily: adjustedDailyGoal,
      monthly: monthlyGoal,
    };
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

export default router;

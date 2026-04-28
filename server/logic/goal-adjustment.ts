import prisma from '../db.js';

const MINIMUM_INVENTORY_THRESHOLD = 10;

export const adjustDailyGoal = async (dailyGoal) => {
  const products = await prisma.product.findMany();
  let adjustedGoal = dailyGoal;

  for (const product of products) {
    if (product.inventory < MINIMUM_INVENTORY_THRESHOLD) {
      // Reduce the daily goal by 10% for each product with low inventory
      adjustedGoal *= 0.9;
    }
  }

  return Math.round(adjustedGoal);
};

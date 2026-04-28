import { Router } from 'express';
import storeRoutes from './stores.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import dashboardRoutes from './dashboard.js';
import adminEmployeeRoutes from './admin/employees.js';
import productionRoutes from './production.js';
import expenseRoutes from './expenses.js';
import goalRoutes from './goals.js';

const router = Router();

// All routes defined here are protected and require authentication

router.use('/admin/employees', adminEmployeeRoutes);
router.use('/stores', storeRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/production', productionRoutes);
router.use('/expenses', expenseRoutes);
router.use('/goals', goalRoutes);

export default router;

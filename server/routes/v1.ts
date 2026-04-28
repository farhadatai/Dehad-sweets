import { Router } from 'express';
import storeRoutes from './stores';
import productRoutes from './products';
import orderRoutes from './orders';
import dashboardRoutes from './dashboard';
import adminEmployeeRoutes from './admin/employees';
import productionRoutes from './production';
import expenseRoutes from './expenses';
import goalRoutes from './goals';

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

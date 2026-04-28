import { Router } from 'express';
import storeRoutes from './stores.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import dashboardRoutes from './dashboard.js';
import adminEmployeeRoutes from './admin/employees.js';
import productionRoutes from './production.js';
import expenseRoutes from './expenses.js';
import goalRoutes from './goals.js';
import employeeSelfServiceRoutes from './employee-self-service.js';

import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = Router();

router.use('/admin/employees', auth, authorize(['ADMIN']), adminEmployeeRoutes);
router.use(auth, authorize(['ADMIN']), storeRoutes);
router.use(auth, authorize(['ADMIN']), productRoutes);
router.use(auth, authorize(['ADMIN']), orderRoutes);
router.use(auth, authorize(['ADMIN']), dashboardRoutes);
router.use('/employee-self-service', auth, authorize(['EMPLOYEE']), employeeSelfServiceRoutes);
router.use(auth, authorize(['ADMIN', 'EMPLOYEE']), goalRoutes);
router.use(auth, authorize(['ADMIN']), productionRoutes);
router.use(auth, authorize(['ADMIN']), expenseRoutes);

export default router;

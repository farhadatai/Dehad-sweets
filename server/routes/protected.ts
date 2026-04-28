import { Router } from 'express';
import storeRoutes from './stores';
import productRoutes from './products';
import orderRoutes from './orders';
import dashboardRoutes from './dashboard';
import adminEmployeeRoutes from './admin/employees';
import productionRoutes from './production';
import expenseRoutes from './expenses';
import goalRoutes from './goals';
import employeeSelfServiceRoutes from './employee-self-service';

import auth from '../middleware/auth';
import authorize from '../middleware/authorize';

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

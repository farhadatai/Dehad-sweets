import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';

import authRoutes from './routes/auth.js';
import storeRoutes from './routes/stores.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import productionRoutes from './routes/production.js';
import expenseRoutes from './routes/expenses.js';
import employeeRoutes from './routes/employees.js';
import inventoryRoutes from './routes/inventory.js';
import operationalRoutes from './routes/operational.js';
import reportRoutes from './routes/reports.js';
import partnerRoutes from './routes/partners.js';
import customerRoutes from './routes/customer.js';

import auth from './middleware/auth.js';
import authorize from './middleware/authorize.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  }
}));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Dehat Sweets and Foods API',
    message: 'Backend is running. Open the frontend at the Vite dev server URL.',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api', partnerRoutes);

app.use('/api/customer', auth, authorize(['CUSTOMER']), customerRoutes);
app.use('/api', auth, authorize(['ADMIN', 'OPERATIONAL']), operationalRoutes);

// Protected admin routes
const adminRouter = express.Router();
adminRouter.use(storeRoutes);
adminRouter.use(productRoutes);
adminRouter.use(orderRoutes);
adminRouter.use(dashboardRoutes);
adminRouter.use(productionRoutes);
adminRouter.use(expenseRoutes);
adminRouter.use(employeeRoutes);
adminRouter.use(inventoryRoutes);
adminRouter.use(reportRoutes);

app.use('/api', auth, authorize(['ADMIN']), adminRouter);

export default app;

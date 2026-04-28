import express from 'express';
import cors from 'cors';
import path from 'path';
import session from 'express-session';

import authRoutes from './routes/auth';
import storeRoutes from './routes/stores';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import dashboardRoutes from './routes/dashboard';
import productionRoutes from './routes/production';
import expenseRoutes from './routes/expenses';
import employeeRoutes from './routes/employees';
import inventoryRoutes from './routes/inventory';
import operationalRoutes from './routes/operational';
import reportRoutes from './routes/reports';
import partnerRoutes from './routes/partners';
import customerRoutes from './routes/customer';

import auth from './middleware/auth';
import authorize from './middleware/authorize';

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

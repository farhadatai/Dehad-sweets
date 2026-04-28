
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Stores from './pages/Stores.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import Employees from './pages/Employees.jsx';
import Production from './pages/Production.jsx';
import Expenses from './pages/Expenses.jsx';
import MonthlyReports from './pages/MonthlyReports.jsx';
import Home from './pages/Home';
import PublicLayout from './layouts/PublicLayout.jsx';
import ProductCatalog from './pages/public/ProductCatalog.jsx';
import ProductsPage from './pages/public/Products.jsx';
import Cart from './pages/public/Cart.jsx';
import Register from './pages/public/Register.jsx';
import StoreLogin from './pages/public/StoreLogin.jsx';
import NewPartnerForm from './pages/public/NewPartnerForm.jsx';
import ProductView from './pages/public/ProductView.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CustomerProtectedRoute from './components/CustomerProtectedRoute.jsx';
import StorePortal from './pages/StorePortal.jsx';
import EmployeeLayout from './layouts/EmployeeLayout.jsx';
import EmployeeLogin from './pages/employee/EmployeeLogin.jsx';
import EmployeeDashboard from './pages/employee/EmployeeDashboard.jsx';
import EmployeeProtectedRoute from './components/EmployeeProtectedRoute.jsx';
import TabletLayout from './layouts/TabletLayout.jsx';
import TabletDashboard from './pages/TabletDashboard.jsx';
import OperationalProtectedRoute from './components/OperationalProtectedRoute.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<ProductCatalog />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productName" element={<ProductView />} />
          <Route path="cart" element={<Cart />} />
          <Route path="register" element={<Register />} />
          <Route path="store-login" element={<StoreLogin />} />
          <Route path="become-a-partner" element={<NewPartnerForm />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/store" element={<StorePortal />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="stores" element={<Stores />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="production" element={<Production />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="reports" element={<MonthlyReports />} />
            <Route path="employees" element={<Employees />} />
          </Route>
        </Route>

        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route element={<EmployeeProtectedRoute />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            {/* Add other employee routes here */}
          </Route>
        </Route>

        <Route element={<OperationalProtectedRoute />}>
          <Route path="/tablet" element={<TabletLayout />}>
            <Route index element={<TabletDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

const DashboardLayout = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    const fullPath = `/dashboard${path === '/dashboard' ? '' : path}`;
    return `sidebar-btn ${location.pathname === fullPath ? 'active' : ''}`;
  };

  return (
    <div className="flex">
      <nav className="w-72 h-screen bg-black text-off-white p-6 flex flex-col justify-between border-r border-gold">
        <div>
          <div className="w-40 h-40 rounded-full mx-auto mb-8 overflow-hidden flex items-center justify-center">
            <img src="/logo.gif?v=1.1" alt="Dehat Sweets and Foods logo" className="object-contain" />
          </div>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link></li>
            <li><Link to="/dashboard/stores" className={getLinkClass('/stores')}>Stores</Link></li>
            <li><Link to="/dashboard/products" className={getLinkClass('/products')}>Products</Link></li>
            <li><Link to="/dashboard/orders" className={getLinkClass('/orders')}>Orders</Link></li>
            <li><Link to="/dashboard/production" className={getLinkClass('/production')}>Production</Link></li>
            <li><Link to="/dashboard/expenses" className={getLinkClass('/expenses')}>Expenses</Link></li>
            <li><Link to="/dashboard/reports" className={getLinkClass('/reports')}>Monthly Data</Link></li>
            <li><Link to="/dashboard/employees" className={getLinkClass('/employees')}>Employees/Payroll</Link></li>
          </ul>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="btn-retheme w-full"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-8 bg-black">
        <Outlet />
      </main>
    </div>
  );
};

export default App;

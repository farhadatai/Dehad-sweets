
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiFetch from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalBoxesOrdered: 0, totalRevenue: 0, activeStores: 0, netProfit: 0 });
  const [showClockIn, setShowClockIn] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [pin, setPin] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState(5000);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchSummary(signal);
        await fetchEmployees(signal);
        await fetchProducts(signal);
        await fetchMonthlyGoal(signal);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else if (error.message === 'Please authenticate.') {
          navigate('/login');
        }
      }
    };
    fetchData();

    return () => {
      controller.abort();
    };
  }, [navigate]);

  const fetchSummary = async (signal) => {
    try {
      const data = await apiFetch('/api/dashboard', { signal });
      setSummary(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch summary:', error);
      }
    }
  };

  const fetchMonthlyGoal = async (signal) => {
    try {
      const data = await apiFetch('/api/production', { signal });
      if (data && data.monthlyGoal) {
        setMonthlyGoal(data.monthlyGoal);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch monthly goal:', error);
      }
    }
  };

  const fetchProducts = async (signal) => {
    try {
      const data = await apiFetch('/api/products', { signal });
      if(Array.isArray(data)){
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch products:', error);
      }
    }
  };

  const fetchEmployees = async (signal) => {
    try {
      const data = await apiFetch('/api/admin/employees', { signal });
      if(Array.isArray(data)){
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch employees:', error);
      }
    }
  };

  const handleClockInOut = async () => {
    if(selectedEmployee === '' || pin === '') {
        setStatusMessage('Please select an employee and enter a PIN.');
        return;
    }
    try {
        const data = await apiFetch('/api/operational/clock', {
            method: 'POST',
            body: JSON.stringify({ employeeId: selectedEmployee, pin }),
        });
        setStatusMessage(data.error || `${data.employeeName} is now ${data.status}`);
    } catch (error) {
        setStatusMessage(error.message);
    }
    setPin('');
  };

  const progress = (summary.totalBoxesOrdered / monthlyGoal) * 100;

  return (
    <div className="container mx-auto p-4">
        {showClockIn && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                <div className="card-retheme p-8">
                    <h2 className="text-xl font-bold mb-4">Employee Clock In/Out</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="p-2 border border-gold rounded w-full md:w-auto bg-card text-off-white"
                        >
                            <option value="" disabled>Select Employee</option>
                            {employees && employees.map(employee => (
                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                            ))}
                        </select>
                        <input
                            type="password"
                            placeholder="4-Digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="p-2 border border-gold rounded w-full md:w-auto bg-card text-off-white"
                            maxLength="4"
                        />
                        <button onClick={handleClockInOut} className="btn-retheme w-full md:w-auto">Submit</button>
                    </div>
                    {statusMessage && <p className="mt-4 text-center">{statusMessage}</p>}
                    <button onClick={() => setShowClockIn(false)} className="mt-4 bg-dark-brown text-gold p-2 rounded hover:bg-gold hover:text-black w-full">Close</button>
                </div>
            </div>
        )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/dashboard/orders" className="btn-retheme">Create New Order</Link>
          <button onClick={() => setShowClockIn(true)} className="btn-retheme">Clock In/Out</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-retheme flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center">Total Boxes Ordered</h2>
          <p className="text-3xl md:text-2xl font-bold">{summary.totalBoxesOrdered}</p>
        </div>
        <div className="card-retheme flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center">Total Revenue</h2>
          <p className="text-3xl md:text-2xl font-bold">${(summary.totalRevenue || 0).toFixed(2)}</p>
        </div>
        <div className="card-retheme flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center">Active Stores</h2>
          <p className="text-3xl md:text-2xl font-bold">{summary.activeStores || 0}</p>
        </div>
        <div className="card-retheme flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center">Net Profit</h2>
          <p className="text-3xl md:text-2xl font-bold">${(summary.netProfit || 0).toFixed(2)}</p>
        </div>
        <div className="card-retheme flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center">Monthly Goal</h2>
          <div className="w-full bg-dark-brown rounded-full h-4 mt-2">
            <div className="bg-gold h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-right text-sm mt-1">{summary.totalBoxesOrdered} / {monthlyGoal} boxes</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Inventory</h2>
        <div className="card-retheme">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header-retheme">
                <th className="p-4">Product</th>
                <th className="p-4">Inventory</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b table-grid-retheme">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import apiFetch from '../../utils/api';

const EmployeeDashboard = () => {
  const [clockInStatus, setClockInStatus] = useState(null);
  const [goals, setGoals] = useState({ daily: 0, monthly: 0 });
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    fetchClockInStatus();
    fetchGoals();
    fetchPendingOrders();
  }, []);

  const fetchClockInStatus = async () => {
    try {
      const data = await apiFetch('/api/employee-self-service/employees/clock/status');
      setClockInStatus(data);
    } catch (error) {
      console.error('Failed to fetch clock in status:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await apiFetch('/api/goals');
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const data = await apiFetch('/api/orders/pending');
      if(Array.isArray(data)){
        setPendingOrders(data);
      } else {
        setPendingOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
    }
  };

  const handleClockInOut = async () => {
    try {
      const data = await apiFetch('/api/employee-self-service/employees/clock', { method: 'POST' });
      setClockInStatus(data);
    } catch (error) {
      console.error('Failed to clock in/out:', error);
    }
  };
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Employee Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Clock In/Out and Goals */}
        <div className="lg:col-span-1 space-y-6">
          {/* Time and Attendance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Time and Attendance</h3>
            <p className="text-gray-600 mb-4">Your current status is: <strong>{clockInStatus ? clockInStatus.status : 'Loading...'}</strong></p>
            <button onClick={handleClockInOut} className={`w-full text-white font-bold py-3 px-4 rounded ${clockInStatus && clockInStatus.status === 'Clocked In' ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'}`}>
              {clockInStatus && clockInStatus.status === 'Clocked In' ? 'Clock Out' : 'Clock In'}
            </button>
          </div>

          {/* Goals */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Goals</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Daily Goal</p>
                <p className="text-2xl font-bold">{goals.daily}</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly Goal</p>
                <p className="text-2xl font-bold">{goals.monthly}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Pending Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-4">{order.id}</td>
                    <td className="p-4">{order.store.name}</td>
                    <td className="p-4">{order.product.name} x {order.quantity}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">{order.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

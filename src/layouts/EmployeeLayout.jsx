import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const EmployeeLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear employee-specific token
    localStorage.removeItem('employee_token');
    navigate('/employee/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark-brown shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.gif?v=1.1" alt="Dehat Sweets and Foods logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold text-white ml-3">Employee Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const EmployeeProtectedRoute = () => {
  const token = localStorage.getItem('employee_token');

  if (!token) {
    return <Navigate to="/employee/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'EMPLOYEE') {
      return <Navigate to="/employee/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token");
    return <Navigate to="/employee/login" replace />;
  }

  return <Outlet />;
};

export default EmployeeProtectedRoute;

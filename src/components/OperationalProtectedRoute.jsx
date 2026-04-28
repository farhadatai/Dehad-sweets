import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const OperationalProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'OPERATIONAL') {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default OperationalProtectedRoute;

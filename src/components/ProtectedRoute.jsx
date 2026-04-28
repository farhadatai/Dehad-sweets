
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'ADMIN') {
      return <Navigate to="/tablet" replace />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

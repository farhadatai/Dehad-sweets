import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CustomerProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/store-login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'CUSTOMER') {
      return <Navigate to={decoded.role === 'OPERATIONAL' ? '/tablet' : '/dashboard'} replace />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/store-login" replace />;
  }

  return <Outlet />;
};

export default CustomerProtectedRoute;

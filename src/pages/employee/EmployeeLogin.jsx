import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../utils/api';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiFetch('/api/employees/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.token) {
        throw new Error(response.error || 'Login failed');
      }

      localStorage.setItem('employee_token', response.token);
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="/logo.gif" alt="Dehat Sweets and Foods logo" className="w-32 h-32" />
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gold mb-8">Employee Portal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gold">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gold">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn-retheme w-full py-3 px-4 text-lg"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;

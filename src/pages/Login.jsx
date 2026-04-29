
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaClipboardList, FaLock, FaTruck } from 'react-icons/fa';

import apiFetch from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    localStorage.clear();
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data.token) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      if (decoded.role === 'CUSTOMER') {
        navigate('/store');
      } else {
        navigate(decoded.role === 'OPERATIONAL' ? '/tablet' : '/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        console.error('Login Failed:', err.response.data.message);
        setError(err.response.data.message);
      } else {
        console.error('Login Failed: An unexpected error occurred.', err);
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-black">
      <section
        className="relative min-h-[calc(100vh-7rem)] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/savory-products.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35"></div>
        <div className="relative z-10 container mx-auto px-5 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 sm:gap-8 items-center">
          <div className="max-w-3xl">
            <p className="text-gold font-bold uppercase tracking-wide mb-3">Management portal</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gold-shiny">
              Run daily orders, baking, and delivery in one place
            </h1>
            <p className="text-lg sm:text-xl text-off-white mt-5 max-w-2xl">
              Sign in to manage production, inventory counts, invoices, store tasks, and monthly operations records.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="border border-gold/40 rounded-lg bg-black/55 p-4">
                <FaClipboardList className="text-gold text-2xl mb-3" />
                <p className="font-bold text-white">Orders</p>
                <p className="text-sm text-off-white mt-1">Track paid, unpaid, ready, and delivered orders.</p>
              </div>
              <div className="border border-gold/40 rounded-lg bg-black/55 p-4">
                <FaLock className="text-gold text-2xl mb-3" />
                <p className="font-bold text-white">Admin Access</p>
                <p className="text-sm text-off-white mt-1">Protected dashboard tools for managers.</p>
              </div>
              <div className="border border-gold/40 rounded-lg bg-black/55 p-4">
                <FaTruck className="text-gold text-2xl mb-3" />
                <p className="font-bold text-white">Delivery</p>
                <p className="text-sm text-off-white mt-1">Prepare invoices and handoffs for drivers.</p>
              </div>
            </div>
          </div>

          <div className="border border-gold/50 rounded-lg bg-[#171717]/95 p-6 md:p-8 shadow-2xl shadow-black/50">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold font-bold mb-2">Management Login</h2>
            <p className="text-off-white mb-7">Enter your Dehat Sweets and Foods management credentials.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="block text-sm font-bold text-gold mb-2">Email</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-retheme w-full min-h-12"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-bold text-gold mb-2">Password</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-retheme w-full min-h-12"
                />
              </label>
              {error && (
                <p className="border border-red-500/60 bg-red-950/40 text-red-200 rounded p-3 text-sm">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-retheme w-full py-3 px-8 text-xl">
                Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;

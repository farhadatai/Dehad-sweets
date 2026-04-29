import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiFetch from '../../utils/api';

const StoreLogin = () => {
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
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);

      if (decoded.role !== 'CUSTOMER') {
        navigate(decoded.role === 'OPERATIONAL' ? '/tablet' : '/dashboard');
        return;
      }

      navigate('/store');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-black">
      <section
        className="relative min-h-[calc(100vh-7rem)] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/cream-rolls.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30"></div>
        <div className="relative z-10 container mx-auto px-5 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6 sm:gap-8 items-center">
          <div>
            <p className="text-gold font-bold uppercase tracking-wide mb-3">Store ordering portal</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gold-shiny">Wholesale ordering made simple</h1>
            <p className="text-lg sm:text-xl text-off-white mt-5 max-w-2xl">
              Approved stores can browse products, place orders, and track unpaid or delivered orders.
            </p>
          </div>

          <div className="border border-gold/50 rounded-lg bg-[#171717]/95 p-6 md:p-8">
            <h2 className="text-3xl sm:text-4xl font-serif text-gold font-bold mb-2">Store Login</h2>
            <p className="text-off-white mb-7">Use your approved store account credentials.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="email" placeholder="Store Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-retheme w-full min-h-12" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-retheme w-full min-h-12" required />
              {error && <p className="border border-red-500/60 bg-red-950/40 text-red-200 rounded p-3 text-sm">{error}</p>}
              <button type="submit" className="btn-retheme w-full py-3 text-xl">Login</button>
            </form>
            <p className="text-center text-off-white mt-5">
              Need an account? <Link to="/become-a-partner" className="text-gold font-bold">Partner Request</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreLogin;

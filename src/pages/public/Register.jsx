import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardCheck, FaStore, FaTruck } from 'react-icons/fa';
import apiFetch from '../../utils/api';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    address: '',
    phone: '',
    requestType: 'Wholesale store account',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await apiFetch('/api/auth/register-store', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setMessage(response.message);
      setForm({
        name: '',
        email: '',
        password: '',
        storeName: '',
        address: '',
        phone: '',
        requestType: 'Wholesale store account',
        notes: '',
      });
    } catch (err) {
      setError(err.message || 'Could not create store account request');
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-black">
      <section
        className="relative min-h-[calc(100vh-7rem)] flex items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/why-dehat.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35"></div>
        <div className="relative z-10 container mx-auto px-5 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 sm:gap-8 items-center">
          <div>
            <p className="text-gold font-bold uppercase tracking-wide mb-3">Partner account request</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gold-shiny">
              Become a partner and order online
            </h1>
            <p className="text-lg sm:text-xl text-off-white mt-5">
              Share your store details once. Management can approve your account, then you can place wholesale orders and track invoices online.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              {[
                { icon: FaStore, title: 'Send Request' },
                { icon: FaClipboardCheck, title: 'Get Approved' },
                { icon: FaTruck, title: 'Order Online' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-gold/40 rounded-lg bg-black/55 p-4">
                    <Icon className="text-gold text-2xl mb-3" />
                    <p className="font-bold text-white">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-gold/50 rounded-lg bg-[#171717]/95 p-6 md:p-8 shadow-2xl shadow-black/50">
            <h2 className="text-3xl sm:text-4xl font-serif text-gold font-bold mb-2">Request Partner Account</h2>
            <p className="text-off-white mb-7">This one form covers partnership inquiry and online store account setup.</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Contact Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="input-retheme w-full" required />
              <input type="text" placeholder="Store Name" value={form.storeName} onChange={(e) => handleChange('storeName', e.target.value)} className="input-retheme w-full" required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="input-retheme w-full" required />
              <input type="text" placeholder="Phone Number" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input-retheme w-full" required />
              <input type="password" placeholder="Create Password for Store Login" value={form.password} onChange={(e) => handleChange('password', e.target.value)} className="input-retheme w-full" required />
              <input type="text" placeholder="Store Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="input-retheme w-full" required />
              <select value={form.requestType} onChange={(e) => handleChange('requestType', e.target.value)} className="input-retheme w-full md:col-span-2">
                <option>Wholesale store account</option>
                <option>Request catalog first</option>
                <option>Request samples first</option>
                <option>Catalog and samples</option>
              </select>
              <textarea placeholder="Products you are interested in or delivery notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="input-retheme w-full md:col-span-2 min-h-28" />
              {message && <p className="md:col-span-2 text-gold text-center">{message}</p>}
              {error && <p className="md:col-span-2 text-red-300 text-center">{error}</p>}
              <button type="submit" className="btn-retheme md:col-span-2 w-full py-3 text-xl">Submit Partner Request</button>
            </form>
            <p className="text-center text-off-white mt-5">
              Already approved? <Link to="/store-login" className="text-gold font-bold">Store Login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;


import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="bg-black text-white min-h-screen" style={{ background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)' }}>
      <nav className="fixed top-0 left-0 w-full z-20 px-3 py-2 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gold/30">
        <div className="container mx-auto flex justify-center sm:justify-end">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto sm:overflow-visible w-full sm:w-auto pb-1 sm:pb-0">
            <Link to="/" className="btn-retheme">Home</Link>
            <Link to="/products" className="btn-retheme">Products</Link>
            <a href="/catalog/dehat-sweets-product-catalog.pdf" download className="btn-retheme">Catalog</a>
            <Link to="/become-a-partner" className="btn-retheme">Partner</Link>
            <Link to="/login" className="btn-retheme">Management</Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

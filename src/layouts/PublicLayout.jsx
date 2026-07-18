import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CONTACT } from '../data/products';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/contact', label: 'Contact' },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu + scroll to top on navigation
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="public-shell bg-parchment text-charcoal min-h-screen flex flex-col font-sans">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-sm border-b border-sand shadow-[0_1px_0_rgba(38,34,28,0.04)]">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3" aria-label="Dehat Sweets and Foods — home">
              <img
                src="/img/logo-160.webp"
                srcSet="/img/logo-160.webp 160w, /img/logo-320.webp 320w"
                sizes="48px"
                alt=""
                width="48"
                height="48"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain"
              />
              <span className="font-serif text-lg sm:text-xl font-bold leading-tight text-forest">
                Dehat <span className="text-burgundy">Sweets &amp; Foods</span>
              </span>
            </Link>

            <nav aria-label="Main" className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className="heritage-link"
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/contact#order" className="btn-forest text-sm px-4 py-2">Order Now</Link>
            </nav>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-sand text-forest"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="md:hidden border-t border-sand bg-cream">
            <ul className="px-5 py-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className="block py-3 text-lg heritage-link"
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 pb-3">
                <Link to="/contact#order" className="btn-forest w-full">Order Now</Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-forest-deep text-cream/90 mt-auto">
        <div className="container mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/img/logo-160.webp" alt="" width="44" height="44" loading="lazy" className="w-11 h-11 rounded-full object-contain" />
                <span className="font-serif text-lg font-bold text-cream">Dehat Sweets &amp; Foods</span>
              </div>
              <p className="text-sm leading-relaxed text-cream/75 max-w-xs">
                Handcrafted Afghan sweets and specialty foods, made for family tables, celebrations, and the stores that serve them.
              </p>
            </div>

            <nav aria-label="Footer">
              <h2 className="font-serif text-saffron-soft text-base font-semibold mb-4">Explore</h2>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/products" className="hover:text-saffron-soft transition-colors">All Products</Link></li>
                <li><Link to="/our-story" className="hover:text-saffron-soft transition-colors">Our Story</Link></li>
                <li><Link to="/wholesale" className="hover:text-saffron-soft transition-colors">Wholesale &amp; Partners</Link></li>
                <li><Link to="/contact" className="hover:text-saffron-soft transition-colors">Contact &amp; Ordering</Link></li>
                <li>
                  <a href={CONTACT.catalogPdf} className="hover:text-saffron-soft transition-colors" download>
                    Download Product Catalog (PDF)
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h2 className="font-serif text-saffron-soft text-base font-semibold mb-4">Order &amp; Contact</h2>
              <ul className="space-y-2.5 text-sm">
                <li><a href={CONTACT.phoneHrefs[0]} className="hover:text-saffron-soft transition-colors">{CONTACT.phones[0]}</a></li>
                <li><a href={CONTACT.phoneHrefs[1]} className="hover:text-saffron-soft transition-colors">{CONTACT.phones[1]}</a></li>
                <li>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-saffron-soft transition-colors">
                    WhatsApp ordering
                  </a>
                </li>
                <li><a href={`mailto:${CONTACT.email}`} className="hover:text-saffron-soft transition-colors">{CONTACT.email}</a></li>
                <li className="text-cream/60">Sacramento area, California</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-saffron-soft text-base font-semibold mb-4">Partners &amp; Team</h2>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/store-login" className="hover:text-saffron-soft transition-colors">Store partner login</Link></li>
                <li><Link to="/register" className="hover:text-saffron-soft transition-colors">Request a partner account</Link></li>
                <li><Link to="/login" className="hover:text-saffron-soft transition-colors">Management</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/60">
            <p>© {new Date().getFullYear()} Dehat Sweets and Foods. All rights reserved.</p>
            <p>Afghan tradition, made to be shared.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

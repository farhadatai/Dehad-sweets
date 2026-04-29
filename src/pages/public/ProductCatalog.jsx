import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaStore, FaTruck } from 'react-icons/fa';
import { GiFamilyHouse, GiLeafSwirl, GiWheat } from 'react-icons/gi';
import { MdVerified } from 'react-icons/md';

const featuredProducts = [
  {
    id: 1,
    name: 'Cream Rolls',
    image: '/cream-rolls.png',
    detail: '9 piece retail boxes',
  },
  {
    id: 2,
    name: 'Root',
    image: '/root.png',
    detail: '1.5 lb boxes',
  },
  {
    id: 3,
    name: 'Malida',
    image: '/malida.png',
    detail: '1.5 lb boxes',
  },
  {
    id: 4,
    name: 'Khajoor',
    image: '/khajoor.png',
    detail: '1.5 lb boxes',
  },
];

const trustItems = [
  { icon: GiWheat, title: 'Authentic Recipes', text: 'Traditional sweets made for stores serving family tables.' },
  { icon: GiLeafSwirl, title: 'Fresh Batches', text: 'Production planning keeps shelves stocked without over-baking.' },
  { icon: MdVerified, title: 'Wholesale Ready', text: 'Case-packed products, clear invoices, and delivery records.' },
  { icon: GiFamilyHouse, title: 'Family Owned', text: 'Built around relationships with local markets and partners.' },
];

const partnerSteps = [
  { icon: FaStore, title: 'Tell us about your store', text: 'Share your location, contact, and product interests.' },
  { icon: FaBoxOpen, title: 'Choose your items', text: 'Review sweets, case counts, and wholesale pricing.' },
  { icon: FaTruck, title: 'Schedule delivery', text: 'Orders flow into production and delivery tracking.' },
];

const LandingPage = () => {
  return (
    <div className="bg-black text-off-white">
      <section
        className="relative min-h-[88vh] flex flex-col md:block bg-cover bg-center pt-28"
        style={{ backgroundImage: "url('/more-than-food.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20"></div>
        <div className="relative z-10 container mx-auto px-5 sm:px-6 pb-10 md:pb-16 flex-1 flex flex-col justify-center">
          <img src="/logo.gif?v=1.1" alt="Dehat Sweets and Foods logo" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover mb-6" />
          <p className="text-gold font-bold uppercase tracking-wide mb-3">Wholesale Afghan sweets and bakery goods</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gold-shiny max-w-4xl leading-tight">
            Dehat Sweets and Foods
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mt-5">
            Fresh bakery favorites for neighborhood markets, families, and everyday celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to="/products" className="btn-gold-shiny text-center text-lg px-6 py-3">View Products</Link>
            <Link to="/become-a-partner" className="btn-retheme text-center text-lg px-6 py-3">
              Become a Partner
            </Link>
          </div>
        </div>
        <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 bg-black/80 border-t border-gold/40">
          <div className="container mx-auto px-5 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm md:text-base">
            <span>Case-packed wholesale products</span>
            <span>Production built from live orders</span>
            <span>Delivery invoices and store records</span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 bg-[#101010]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Bakery Favorites</h2>
              <p className="text-off-white mt-2 max-w-2xl">
                A focused product line for markets that need reliable sweets, clear case counts, and easy reordering.
              </p>
            </div>
            <Link to="/products" className="btn-retheme md:w-auto text-center">See Full Catalog</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-[#1f1f1f] border border-gold/40 rounded-lg overflow-hidden hover:border-gold transition-colors"
              >
                <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" />
                <div className="p-4">
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="text-sm text-off-white mt-1">{product.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 bg-black">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Made for Store Partners</h2>
            <p className="text-lg text-off-white mt-4">
              Dehat Sweets and Foods supports wholesale partners with product visibility, order tracking, delivery invoices, and monthly records that keep operations clear.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {partnerSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="border border-gold/40 rounded-lg p-4 bg-[#171717]">
                    <Icon className="text-gold text-3xl mb-3" />
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-sm text-off-white mt-2">{step.text}</p>
                  </div>
                );
              })}
            </div>
            <Link to="/become-a-partner" className="btn-gold-shiny inline-block mt-8 text-lg px-6 py-3">Request Wholesale Info</Link>
          </div>
          <img src="/why-dehat.png" alt="Why stores choose Dehat Sweets and Foods" className="w-full rounded-lg shadow-lg object-cover max-h-[520px]" />
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 bg-[#101010]">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <img src="/about-dehat.png" alt="About Dehat Sweets and Foods" className="w-full rounded-lg shadow-lg object-cover max-h-[520px]" />
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Traditional Taste, Organized Delivery</h2>
            <p className="text-lg text-off-white mt-4">
              From cream rolls to classic sweets, every order moves through production planning, inventory counts, delivery status, and invoices so store partners know what is coming and when.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-gold/40 rounded-lg p-4 bg-black">
                    <Icon className="text-gold text-3xl mb-3" />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-off-white mt-2">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-6 bg-black">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Bring Dehat to Your Shelves</h2>
            <p className="text-lg text-off-white mt-4 max-w-3xl">
              Partner with a local sweets producer built for repeat wholesale orders, clear delivery handoff, and monthly records.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link to="/become-a-partner" className="btn-gold-shiny text-center text-lg px-6 py-3">Become a Partner</Link>
            <Link to="/products" className="btn-retheme text-center text-lg px-6 py-3">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

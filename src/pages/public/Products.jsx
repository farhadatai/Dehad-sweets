
import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Cream Rolls',
    slug: 'cream-rolls',
    image: '/cream-rolls.png',
  },
  {
    id: 2,
    name: 'Root',
    slug: 'root',
    image: '/root.png',
  },
  {
    id: 3,
    name: 'Malida',
    slug: 'malida',
    image: '/malida.png',
  },
  {
    id: 4,
    name: 'Khajoor',
    slug: 'khajoor',
    image: '/khajoor.png',
  },
  {
    id: 5,
    name: 'Afghan Torshi',
    slug: 'afghan-torshi',
    image: '/afghan-torshi.png',
  },
  {
    id: 6,
    name: 'Afghan Chatni Green',
    slug: 'afghan-chatni-green',
    image: '/afghan-chatni-green.png',
  },
  {
    id: 7,
    name: 'Afghan Chatni Red',
    slug: 'afghan-chatni-red',
    image: '/afghan-chatni-red.png',
  },
  {
    id: 8,
    name: 'Masali Deg',
    slug: 'masali-deg',
    image: '/masali-deg.png',
  },
  {
    id: 9,
    name: 'Masala Dar Pepper',
    slug: 'masala-dar-pepper',
    image: '/masala-dar-pepper.png',
  },
];

const ProductsPage = () => {
  return (
    <section className="py-12 sm:py-20 px-5 sm:px-6 pt-36 sm:pt-40">
      <h2 className="text-4xl sm:text-5xl font-serif text-gold text-center font-bold mb-8 sm:mb-12">Products</h2>
      <div className="container mx-auto mb-8 flex justify-center">
        <a href="/catalog/dehat-sweets-product-catalog.pdf" download className="btn-gold-shiny text-center text-lg px-6 py-3">
          Download Product Catalog
        </a>
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 place-items-center">
        {products.map(product => (
          <Link to={`/products/${product.slug}`} key={product.id} className="w-full bg-[#111] border border-gold/35 rounded-lg overflow-hidden shadow-lg hover:border-gold transition-colors">
            <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" />
            <h3 className="text-xl font-bold text-gold px-4 py-3">{product.name}</h3>
          </Link>
        ))}
      </div>
      <div className="container mx-auto mt-12">
        <img src="/savory-products.png" alt="Dehat savory products" className="w-full h-auto rounded-lg shadow-lg" />
      </div>
    </section>
  );
};

export default ProductsPage;

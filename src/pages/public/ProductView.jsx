
import React from 'react';
import { useParams } from 'react-router-dom';

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

const ProductView = () => {
  const { productName } = useParams();
  const product = products.find(p => p.slug === productName);

  if (!product) {
    return <div className="h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
    </div>
  );
};

export default ProductView;

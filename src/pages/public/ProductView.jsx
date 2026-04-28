
import React from 'react';
import { useParams } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Cream Rolls',
    slug: 'cream-rolls',
    image: '/cream-roll-feature.png',
  },
  {
    id: 2,
    name: 'Root',
    slug: 'root',
    image: '/Root.jpg',
  },
  {
    id: 3,
    name: 'Malida',
    slug: 'malida',
    image: '/Malida.jpg',
  },
  {
    id: 4,
    name: 'Khajoor',
    slug: 'khajoor',
    image: '/Khajoor.jpg',
  },
  {
    id: 5,
    name: 'Afghan Torshi',
    slug: 'afghan-torshi',
    image: '/afghan-torshi.png',
  },
  {
    id: 6,
    name: 'Afghan Chatni Green / Red',
    slug: 'afghan-chatni',
    image: '/afghan-chatni.png',
  },
  {
    id: 7,
    name: 'Masali Deg',
    slug: 'masali-deg',
    image: '/masali-deg.png',
  },
  {
    id: 8,
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

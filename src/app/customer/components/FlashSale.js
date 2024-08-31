'use client'
import React from 'react';
import 'tailwindcss/tailwind.css';

const products = [
  {
    name: 'NESTLE LACTOGROW 3 Growing-up Formula',
    image: '/path/to/lactogrow.jpg',
    price: 2565,
    originalPrice: 2700,
    discount: '-5%',
  },
  {
    name: 'Airpro Double and Airpods Wireless Bluetooth Handfree',
    image: '/airpods.jpg',
    price: 899,
    originalPrice: 4000,
    discount: '-77%',
  },
  {
    name: 'New TWS Air 31 Airpods handfree',
    image: '/tws-airpods.jpg',
    price: 945,
    originalPrice: 4500,
    discount: '-79%',
  },
  {
    name: 'OKS® W26 Pro Max Special Edition IPS',
    image: '/oks-watch.jpg',
    price: 2279,
    originalPrice: 2282,
    discount: '-0%',
  },
  {
    name: 'Body Spray Pack of 3 For Men Gift | Big Bottle 200ml',
    image: '/body-spray.jpg',
    price: 880,
    originalPrice: 3000,
    discount: '-70%',
  },
  {
    name: 'Lipstick Pencil pack of 12/6 Lip liner Lip Pencil',
    image: '/lipstick-pencil.jpg',
    price: 419,
    originalPrice: 799,
    discount: '-47%',
    soldOut: true,
  },
];

const FlashSale = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Flash Sale</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-red-500 font-semibold">On Sale Now</span>
        <div className="flex items-center space-x-1">
          <span>Ending in</span>
          <div className="flex items-center space-x-1">
            <div className="bg-orange-500 text-white px-2 py-1 rounded">08</div>
            <span>:</span>
            <div className="bg-orange-500 text-white px-2 py-1 rounded">11</div>
            <span>:</span>
            <div className="bg-orange-500 text-white px-2 py-1 rounded">47</div>
          </div>
        </div>
        <button className="text-orange-500 border border-orange-500 px-4 py-2 rounded hover:bg-orange-500 hover:text-white transition">Shop More</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden text-center p-4 relative transform transition duration-300 hover:scale-105 hover:shadow-xl">
            {product.soldOut && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">SOLD OUT</div>
            )}
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
            <p className="text-sm">{product.name}</p>
            <p className="text-red-500 font-semibold">Rs.{product.price}</p>
            <p className="text-gray-500 line-through">Rs.{product.originalPrice}</p>
            <p className="text-green-500">{product.discount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
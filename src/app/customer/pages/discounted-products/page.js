'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/cartSlice';

const DiscountedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/discounted');
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discounted products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - (price * (discount / 100));
    }
    return price;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold pl-4 mb-6">Offers</h2>
      <div className=" p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => {
          const originalPrice = calculateOriginalPrice(product.price, product.discount);
          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-sm  cursor-pointer border border-gray-300 relative h-[300px] w-full min-w-[150px]"
            >
             {product.discount && (
  <div className="absolute z-40 top-0 left-0 bg-red-100 text-red-600 font-normal text-sm px-1 py-0.5">
    {product.discount.toFixed(2)}% OFF
  </div>
)}


              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <motion.img
                    src={`https://data.tascpa.ca/uploads/${product.images[0].url}`}
                    alt={product.name}
                    className="h-[200px] md:h-[200px] w-full object-cover mb-4 rounded bg-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleProductClick(product.id)}
                  />
                ) : (
                  <div
                    className="h-[240px] md:h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500"
                    onClick={() => handleProductClick(product.id)}
                  >
                    No Image
                  </div>
                )}
                <button
                  className="absolute bottom-2 right-2 bg-teal-500 text-white h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
                  onClick={() => handleProductClick(product.id)}
                >
                  <span className="text-xl font-bold leading-none">+</span>
                </button>
              </div>
              <div className="px-2">
                
                <div className="grid grid-cols-2 py-2">
                <div className="flex items-center">
                {product.discount ? (
  <div className="flex items-center justify-center gap-3 flex-row-reverse">
    <p className="text-xs font-normal text-gray-700 line-through">
      Rs.{formatPrice(product.price)}  {/* Format original price */}
    </p>
    <p className="text-sm font-bold text-red-700">
      Rs.{formatPrice(originalPrice)}  {/* Format discounted price */}
    </p>
  </div>
) : (
  <p className="text-sm font-bold text-gray-700">
    Rs.{formatPrice(product.price)}  {/* Format non-discounted price */}
  </p>
)}
                  </div>
                </div>
                <h3
                              className="text-sm font-normal text-gray-800 overflow-hidden hover:underline hover:text-blue-400 cursor-pointer"
                              style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2, // Limits to 2 lines
                                maxHeight: '3em', // Approximate height for 2 lines
                              }}
                              onClick={() => handleProductClick(product.id)}
                            >
                              {product.name.toUpperCase()}
                            </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountedProducts;

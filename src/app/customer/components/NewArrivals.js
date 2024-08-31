'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import { FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/newArrivals');
        console.log('Fetched New Arrivals:', response.data); // Debugging line
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
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
      <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {products.map((product) => {
          const originalPrice = calculateOriginalPrice(product.price, product.discount);
          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-300 relative h-[430px]"
            >
              {product.discount && (
                <div className="absolute z-40 top-2 right-2 bg-black text-white rounded-full h-10 w-10 flex items-center justify-center">
                  -{product.discount}%
                </div>
              )}
              {/* {product.stock ===0 && (
                <div className="absolute z-40 top-4 left-1 bg-red-500 text-white  h-6 w-20 flex items-center justify-center">
                  Out Stock
                </div>
              )}
              {product.stock >0 && (
                <div className="absolute z-40 top-4 left-0 bg-green-500 text-white  h-6  w-20 flex items-center justify-center">
                  In Stock 
                </div>
              )} */}
              {product.images && product.images.length > 0 ? (
                <motion.img
                  src={`https://data.tascpa.ca/uploads/${product.images[0].url}`}
                  alt={product.name}
                  className="h-80 w-full object-cover mb-4 rounded"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleProductClick(product.id)}
                />
              ) : (
                <div
                  className="h-96 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500"
                  onClick={() => handleProductClick(product.id)}
                >
                  No Image
                </div>
              )}
              <h3 className="pt-4 px-2 text-md font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
              <div className='grid grid-cols-2'>
                
              <div className="flex items-center px-2">
                {product.discount ? (
                  <div className='flex flex-col'>
                  <>
                    <p className="text-md font-normal text-gray-700 line-through mr-2">
                      Rs.{product.price}
                    </p>
                    <p className="text-md font-normal text-red-700">
                      Rs.{originalPrice}
                    </p>
                  </>
                  </div>
                ) : (
                  <p className="text-md font-normal text-gray-700">
                    Rs.{product.price}
                  </p>
                )}
             
              </div>
              <div className='flex justify-end'>
              <button
  className="absolute bottom-4 right-2 border border-gray-700 h-5 w-16 text-xs hover:text-blue-700 text-gray-700 font-normal flex justify-center items-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors duration-300"
  onClick={() => handleProductClick(product.id)}
>
  Shop Now
</button>

              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewArrivals;

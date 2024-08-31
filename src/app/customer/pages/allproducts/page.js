'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '@/app/store/cartSlice';
import { useRouter } from 'next/navigation';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCartState] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchProducts = useCallback(async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products/search/${encodeURIComponent(query)}`);
      const fetchedProducts = response.data.data.map(product => ({
        ...product,
        images: JSON.parse(product.images), // Parse the images field to convert it to an array
      }));
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('search') || '';
      setSearchQuery(query);
      fetchProducts(query);
    };

    // Initial load
    handleRouteChange();

    // Detect URL changes using a custom interval
    const interval = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('search') || '';
      if (query !== searchQuery) {
        handleRouteChange();
      }
    }, 1000); // Adjust the interval time as needed

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [fetchProducts, searchQuery]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
  };

  const handleProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - (price * (discount / 100));
    }
    return price;
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartState(storedCart);
    dispatch(setCart(storedCart));
  }, [dispatch]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map((product) => {
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
                    src={`https://data.tascpa.ca/uploads/${product.images[0]}`}
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
                <h3 className="pt-4 px-2 text-md font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.name}
                </h3>
                <div className="grid grid-cols-2">
                  <div className="flex items-center px-2">
                    {product.discount ? (
                      <div className="flex flex-col">
                        <p className="text-md font-normal text-gray-700 line-through mr-2">
                          Rs.{product.price}
                        </p>
                        <p className="text-md font-normal text-red-700">
                          Rs.{originalPrice}
                        </p>
                      </div>
                    ) : (
                      <p className="text-md font-normal text-gray-700">
                        Rs.{product.price}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
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
          })
        ) : (
          <div className="text-center col-span-full py-8 text-gray-500">
            No products found for "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;

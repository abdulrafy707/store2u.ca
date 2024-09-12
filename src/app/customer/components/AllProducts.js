import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12); // Show 12 products initially
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/topRated');
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);
        setLoading(false);
        console.log('Products fetched:', fetchedProducts.length);
      } catch (error) {
        console.error('Error fetching top-rated products:', error);
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

  const showMoreProducts = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12); // Load 12 more products
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - price * (discount / 100);
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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Top Rated</h2>

      {/* Grid with increased width on larger screens */}
      <div className="rounded grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 px-2 sm:px-4 lg:px-0">
        {products.slice(0, visibleProducts).map((product) => {
          const originalPrice = calculateOriginalPrice(product.price, product.discount);
          return (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-sm cursor-pointer border border-gray-300 relative min-h-[320px] w-full"
            >
              {product.discount && (
                <div className="absolute z-40 top-2 right-2 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center">
                  -{product.discount}%
                </div>
              )}
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <motion.img
                    src={`https://data.tascpa.ca/uploads/${product.images[0].url}`}
                    alt={product.name}
                    className="h-[240px] w-full object-cover mb-4 rounded bg-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleProductClick(product.id)}
                  />
                ) : (
                  <div
                    className="h-[240px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500"
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
                          Rs.{product.price}
                        </p>
                        <p className="text-sm font-semibold text-red-700">
                          Rs.{originalPrice}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-normal text-gray-700">Rs.{product.price}</p>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show "Show More" Button if there are more products to display */}
      {visibleProducts < products.length && (
        <div className="text-center mt-6">
        <button
          className="border border-gray-500 text-gray-700 bg-transparent py-2 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
          onClick={showMoreProducts}
        >
          Show More
        </button>
      </div>
      
      )}
    </div>
  );
};

export default TopRatedProducts;

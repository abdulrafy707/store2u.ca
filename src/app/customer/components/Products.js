'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const productRefs = useRef([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryResponse = await axios.get('/api/categories');
        const categoriesData = categoryResponse.data;
        setCategories(categoriesData);

        const subcategoryResponse = await axios.get('/api/subcategories');
        const subcategoriesData = subcategoryResponse.data;
        setSubcategories(subcategoriesData);

        const productsResponse = await axios.get('/api/products');
        const productsData = productsResponse.data;
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories and products:', error);
        setLoading(false);
      }
    };
    fetchCategoriesAndSubcategories();
  }, []);

  const handleProductClick = (id) => {
    router.push(`/customer/pages/products/${id}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} has been added to the cart.`);
  };

  const scrollLeft = (index) => {
    if (productRefs.current[index]) {
      productRefs.current[index].scrollBy({
        left: -200, // Adjust scrolling distance as needed
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (index) => {
    if (productRefs.current[index]) {
      productRefs.current[index].scrollBy({
        left: 200, // Adjust scrolling distance as needed
        behavior: 'smooth',
      });
    }
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
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        {categories.map((category, index) => {
          const categorySubcategories = subcategories.filter(
            (subcat) => subcat.categoryId === category.id
          );
          const categoryProducts = products.filter((product) =>
            categorySubcategories.some(
              (subcat) => subcat.id === product.subcategoryId
            )
          );

          return (
            <div key={category.id} className="mb-12">
              <h3 className="text-xl text-gray-800 font-normal mt-4 text-center md:text-left">
                {category.name}
              </h3>
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="md:w-1/3 w-full md:pr-4 mb-4 md:mb-0 flex flex-col items-center md:items-start">
                  {category.imageUrl ? (
                    <img
                      src={`https://data.tascpa.ca/uploads/${category.imageUrl}`}
                      alt={category.name}
                      className="w-full max-w-[350px] md:max-w-[380px] h-[200px] md:h-[300px] rounded-lg shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-full max-w-[380px] h-[220px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <p className="text-gray-500 mt-2 text-center md:text-left">
                    {category.description}
                  </p>
                </div>
                <div className="md:w-2/3 w-full relative flex items-center">
                  <FiChevronLeft
                    className="h-8 w-8 text-gray-500 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => scrollLeft(index)}
                  />
                  <div
                    ref={(el) => (productRefs.current[index] = el)}
                    className="flex space-x-4 md:space-x-2 overflow-hidden pl-8 pr-8 w-full"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {categoryProducts.slice(0, 4).map((product) => {
                      const originalPrice = calculateOriginalPrice(
                        product.price,
                        product.discount
                      );
                      return (
                        <div
                          key={product.id}
                          className="bg-white shadow-md  cursor-pointer border border-gray-300 relative h-[320px] md:h-[300px] w-[220px] md:w-[200px] flex-shrink-0"
                          style={{ scrollSnapAlign: 'start' }}
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
                                className="h-[240px] md:h-[220px] w-full object-cover mb-4  bg-white"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => handleProductClick(product.id)}
                              />
                            ) : (
                              <div className="h-[240px] md:h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
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
                            <h3 className="text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                              {product.name}
                            </h3>
                            <div className="grid grid-cols-2 px-0 py-2">
                <div className="flex items-center">
                  {product.discount ? (
                    <div className="flex items-center justify-center  gap-3 flex-row-reverse">
                      <p className="text-xs font-normal text-gray-700 line-through ">
                        Rs.{product.price}
                      </p>
                      <p className="text-sm font-semibold text-red-700">
                        Rs.{originalPrice}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-normal text-gray-700">
                      Rs.{product.price}
                    </p>
                  )}
                </div>
              </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <FiChevronRight
                    className="h-8 w-8 text-gray-500 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => scrollRight(index)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;

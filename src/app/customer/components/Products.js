'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
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
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (index) => {
    if (productRefs.current[index]) {
      productRefs.current[index].scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
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
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        {categories.map((category, index) => {
          const categorySubcategories = subcategories.filter(subcat => subcat.categoryId === category.id);
          const categoryProducts = products.filter(product =>
            categorySubcategories.some(subcat => subcat.id === product.subcategoryId)
          );

          if (!productRefs.current[index]) {
            productRefs.current[index] = React.createRef();
          }

          return (
            <div key={category.id} className="mb-12">
              <div className="flex md:flex-row flex-col">
                <div className="md:w-1/4 w-full pr-4">
                  <h3 className="text-xl text-gray-800 font-normal mt-4">{category.name}</h3>
                  {category.imageUrl ? (
                    <img
                      src={`https://data.tascpa.ca/uploads/${category.imageUrl}`}
                      alt={category.name}
                      className="w-full h-[300px] rounded-lg shadow-md"
                    ></img>
                  ) : (
                    <div className="w-full sm:w-full md:w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <p className="text-gray-500 mt-2">{category.description}</p>
                </div>
                <div className="md:w-3/4 w-full relative">
                  <FiChevronLeft
                    className="h-6 w-6 text-gray-500 cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                    onClick={() => scrollLeft(index)}
                  />
                  <div ref={el => (productRefs.current[index] = el)} className="flex space-x-4 overflow-x-hidden pl-8 pr-8">
                    {categoryProducts.length > 0 ? (
                      categoryProducts.map((product) => {
                        const originalPrice = calculateOriginalPrice(product.price, product.discount);
                        return (
                          <div
                            key={product.id}
                            className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-300 relative h-[430px] w-[250px] flex-shrink-0"
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
                                className="h-80 w-full object-cover mb-4 rounded bg-white"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => handleProductClick(product.id)}
                              />
                            ) : (
                              <div className="h-80 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                                No Image
                              </div>
                            )}
                            <div className="px-2">
                              <h3 className="text-md font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</h3>
                              <div className='grid grid-cols-2'>
                              <div className="flex items-center">
                                {product.discount ? (
                                  <div className='flex flex-col'>
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
                           
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center col-span-full py-8 text-gray-500">No products available in this category.</div>
                    )}
                  </div>
                  <FiChevronRight
                    className="h-6 w-6 text-gray-500 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
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

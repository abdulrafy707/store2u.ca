'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ThreeDots } from 'react-loader-spinner';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [productIndices, setProductIndices] = useState({});

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

        // Initialize the current product index for each category
        const initialIndices = {};
        categoriesData.forEach((category) => {
          initialIndices[category.id] = 0; // Start from the first product
        });
        setProductIndices(initialIndices);

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

  const scrollRight = (categoryId, categoryProducts) => {
    setProductIndices((prevIndices) => {
      const nextIndex = Math.min(prevIndices[categoryId] + 1, categoryProducts.length - 1);
      return { ...prevIndices, [categoryId]: nextIndex };
    });
  };

  const scrollLeft = (categoryId) => {
    setProductIndices((prevIndices) => {
      const prevIndex = Math.max(prevIndices[categoryId] - 1, 0);
      return { ...prevIndices, [categoryId]: prevIndex };
    });
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
        {categories.map((category) => {
          const categorySubcategories = subcategories.filter(
            (subcat) => subcat.categoryId === category.id
          );
          const categoryProducts = products.filter((product) =>
            categorySubcategories.some(
              (subcat) => subcat.id === product.subcategoryId
            )
          );

          if (categoryProducts.length === 0) return null;

          const currentProductIndex = productIndices[category.id] || 0;
          const visibleProducts = categoryProducts.slice(currentProductIndex, currentProductIndex + (window.innerWidth < 640 ? 2 : 4));



          return (
            <div key={category.id} className="mb-12">
              <h3 className="text-xl text-gray-800 font-normal mt-4 text-center md:text-left">
                {category.name}
              </h3>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-start">
                <div className="category-image">
                  {category.imageUrl ? (
                    <img
                      src={`https://data.tascpa.ca/uploads/${category.imageUrl}`}
                      alt={category.name}
                      className="w-full h-[200px] md:h-[300px] rounded-lg shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-[220px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <p className="text-gray-500 mt-2 text-center md:text-left">
                    {category.description}
                  </p>
                </div>

                <div className="relative">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">



                    {visibleProducts.map((product) => {
                      const originalPrice = calculateOriginalPrice(
                        product.price,
                        product.discount
                      );
                      return (
                        <div
                          key={product.id}
                          className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-300 relative h-[320px] flex-shrink-0"
                        >
                          {product.discount && (
                            <div className="absolute z-40 top-2 right-2 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center">
                              -{product.discount}%
                            </div>
                          )}
                          <div className="relative">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={`https://data.tascpa.ca/uploads/${product.images[0].url}`}
                                alt={product.name}
                                className="h-[240px] w-full object-cover mb-4 rounded bg-white"
                                onClick={() => handleProductClick(product.id)}
                              />
                            ) : (
                              <div className="h-[240px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
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
                            <h3 className="text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                              {product.name}
                            </h3>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Left Arrow */}
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                    onClick={() => scrollLeft(category.id)}
                    disabled={currentProductIndex === 0}
                  >
                    <FiChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                    onClick={() => scrollRight(category.id, categoryProducts)}
                    disabled={currentProductIndex + 4 >= categoryProducts.length}
                  >
                    <FiChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
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

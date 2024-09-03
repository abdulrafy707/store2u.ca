'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';

const fetchSubcategoriesByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`/api/subcategories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

const fetchProductsBySubcategoryIds = async (subcategoryIds) => {
  try {
    const response = await axios.get(`/api/products?subcategoryIds=${subcategoryIds.join(',')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const CategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [highestPrice, setHighestPrice] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(14); // Show 14 products initially
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        const categoryResponse = await axios.get(`/api/categories/${id}`);
        setCategory(categoryResponse.data);
  
        const subcategoriesData = await fetchSubcategoriesByCategoryId(id);
        setSubcategories(subcategoriesData);
  
        if (subcategoriesData.length > 0) {
          const subcategoryIds = subcategoriesData.map((subcategory) => subcategory.id);
          const productsData = await fetchProductsBySubcategoryIds(subcategoryIds);
          setProducts(productsData);
  
          // Filter products to show only those related to the current category by default
          const filtered = productsData.filter(product => subcategoryIds.includes(product.subcategoryId));
          setFilteredProducts(filtered);
  
          const highestProductPrice = Math.max(...filtered.map((product) => product.price));
          setHighestPrice(highestProductPrice);
          setPriceRange({ min: 0, max: highestProductPrice });
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false); // Stop loading once data is fetched
      }
    };
  
    if (id) {
      fetchCategoryData();
    }
  }, [id]);
  

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(subcategoryId, priceRange);
  };

  const handleShowAllProducts = () => {
    setSelectedSubcategory(null);
    const subcategoryIds = subcategories.map((subcategory) => subcategory.id);
    const allSubcategoryProducts = products.filter((product) => subcategoryIds.includes(product.subcategoryId));
    setFilteredProducts(allSubcategoryProducts);
  };

  const handlePriceFilterChange = (min, max) => {
    setPriceRange({ min, max });
    filterProducts(selectedSubcategory, { min, max });
  };

  const filterProducts = (subcategoryId, { min, max }) => {
    let filtered = products;
    if (subcategoryId) {
      filtered = filtered.filter((product) => product.subcategoryId === subcategoryId);
    }
    filtered = filtered.filter((product) => product.price >= min && product.price <= max);
    setFilteredProducts(filtered);
  };

  const getImageUrl = (url) => {
    return `https://data.tascpa.ca/uploads/${url}`;
  };

  const handleProductClick = (product) => {
    const originalPrice = product.discount
      ? calculateOriginalPrice(product.price, product.discount)
      : product.price;

    router.push(`/customer/pages/products/${product.id}?originalPrice=${originalPrice}`);
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - (price * (discount / 100));
    }
    return price;
  };

  const showMoreProducts = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 14); // Load 14 more products
  };

  if (isLoading) {
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
    <div className="container mx-auto bg-white px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">{category?.name}</h2>
      <div className="flex flex-wrap space-x-2 mb-6 overflow-x-auto">
        <button
          className={`cursor-pointer p-2 rounded ${!selectedSubcategory ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={handleShowAllProducts}
        >
          All
        </button>
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            className={`cursor-pointer p-2 rounded ${selectedSubcategory === subcategory.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => handleSubcategoryClick(subcategory.id)}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center space-x-4">
          <span className="font-semibold">Filter:</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span>Price</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceFilterChange(Number(e.target.value), priceRange.max)}
                className="border border-gray-300 p-2 rounded w-full sm:w-auto"
                placeholder="From"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceFilterChange(priceRange.min, Number(e.target.value))}
                className="border border-gray-300 p-2 rounded w-full sm:w-auto"
                placeholder="To"
              />
            </div>
            <span className="block text-sm text-gray-500 mt-1 sm:mt-0">The highest price is Rs.{highestPrice}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
  {filteredProducts.slice(0, visibleProducts).map((product) => {
    const originalPrice = calculateOriginalPrice(product.price, product.discount);
    return (
      <div
        key={product.id}
        className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-300 relative h-[320px] md:h-[300px] w-[220px] md:w-[200px] flex-shrink-0"
        onClick={() => handleProductClick(product)}
      >
        {product.discount && (
          <div className="absolute z-40 top-2 right-2 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center">
            -{product.discount}%
          </div>
        )}
        <div className="relative">
          {product.images && product.images.length > 0 ? (
            <motion.img
              src={getImageUrl(product.images[0].url)}
              alt={product.name}
              className="h-[240px] md:h-[220px] w-full object-cover mb-4 rounded bg-white"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div
              className="h-[240px] md:h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500"
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
        <h3 className="pt-2 px-2 text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
          {product.name}
        </h3>
        <div className="grid grid-cols-2 py-2">
          <div className="flex items-center">
            {product.discount ? (
              <div className="flex  items-center justify-center  gap-3 flex-row-reverse">
                <p className="text-xs font-normal text-gray-700 line-through mr-2">
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
    );
  })}
</div>

      {visibleProducts < filteredProducts.length && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            onClick={showMoreProducts}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

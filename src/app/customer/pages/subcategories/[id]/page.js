'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { motion } from 'framer-motion';

const SubcategoryPage = () => {
  const { id } = useParams();  // Get the subcategory ID from the URL
  const subcategoryId = parseInt(id, 10);  // Ensure subcategoryId is treated as a number
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);  // Placeholder for default max value
  const [highestPrice, setHighestPrice] = useState(0);  // Track the highest price

  useEffect(() => {
    const fetchSubcategoryData = async () => {
      setIsLoading(true);
      try {
        // Fetch subcategory details
        const subcategoryResponse = await axios.get(`/api/subcategories/${subcategoryId}`);
        setSubcategory(subcategoryResponse.data);

        // Fetch all products and filter by the specific subcategory
        const productsResponse = await axios.get(`/api/products`);
        const filteredProducts = productsResponse.data.filter(product => product.subcategoryId === subcategoryId);
        
        setProducts(filteredProducts);  // Set only products related to this subcategory
        setFilteredProducts(filteredProducts);  // Initialize filtered products

        // Find the highest price in the products and set it as the max price
        const maxProductPrice = Math.max(...filteredProducts.map(product => product.price));
        setMaxPrice(maxProductPrice);
        setHighestPrice(maxProductPrice);  // Update highest price for display
      } catch (error) {
        console.error('Error fetching subcategory data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subcategoryId) {
      fetchSubcategoryData();
    }
  }, [subcategoryId]);  // Only re-run the effect when subcategoryId changes

  const handleFilter = () => {
    const filtered = products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">{subcategory?.name}</h2>

      {/* Price Filter */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full sm:w-auto"
            placeholder="Min"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full sm:w-auto"
            placeholder="Max"
            max={highestPrice}  // Set the max attribute to the highest product price
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md cursor-pointer border border-gray-300 relative h-[320px] md:h-[300px] w-[220px] md:w-[200px] flex-shrink-0"
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
                    className="h-[240px] md:h-[220px] w-full object-cover mb-4 rounded bg-white"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="h-[240px] md:h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="pt-2 px-2 text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                {product.name}
              </h3>
              <div className="grid grid-cols-2 pl-2 py-2">
                <div className="flex items-center">
                  {product.discount ? (
                    <div className="flex items-center justify-center gap-3 flex-row-reverse">
                      <p className="text-xs font-normal text-gray-700 line-through">Rs.{product.price}</p>
                      <p className="text-sm font-semibold text-red-700">Rs.{(product.price - (product.price * product.discount / 100)).toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-sm font-normal text-gray-700">Rs.{product.price}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;

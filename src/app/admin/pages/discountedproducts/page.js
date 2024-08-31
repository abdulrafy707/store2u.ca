'use client';
import React, { useEffect, useState } from 'react';
import FilterableDiscountedTable from './FilterableTable.js';

const DiscountedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await fetch('/api/products/discounted');
        const data = await response.json();
        setProducts(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch discounted products', error);
        setIsLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      ) : (
        <FilterableDiscountedTable products={products} />
      )}
    </div>
  );
};

export default DiscountedProductsPage;

'use client'
import React, { useEffect, useState } from 'react';
import FilterableTable from './FilterableTable';

const TopRatedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await fetch('/api/products/topRated');
        const data = await response.json();
        setProducts(data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch top-rated products', error);
        setIsLoading(false);
      }
    };

    fetchTopRatedProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      ) : (
        <FilterableTable products={products} />
      )}
    </div>
  );
};

export default TopRatedProductsPage;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';

const TopCategories = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Replace with your actual API endpoint
        console.log('Fetched Categories:', response.data); // Debugging line
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    router.push(`/customer/pages/category/${categoryId}`);
  };

  const backgroundColors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-gray-100', 'bg-yellow-100'
  ];

  return (
    <div className="container mx-auto  py-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className={`${backgroundColors[index % backgroundColors.length]} rounded  overflow-hidden text-center p-2 cursor-pointer`}
            onClick={() => handleCategoryClick(category.id)}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '210px' }} // Adjust the minHeight value as needed
          >
            {category.imageUrl ? (
              <motion.img
                src={`https://data.tascpa.ca/uploads/${category.imageUrl}`}
                alt={category.name}
                className="w-full h-40 object-cover mb-2" // Decreased height
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  console.error(`Failed to load image: ${e.target.src}`);
                  e.target.onerror = null; 
                  e.target.src = '/fallback-image.jpg'; // Replace with a path to a fallback image
                }}
              />
            ) : (
              <img
                src="/fallback-image.jpg"
                alt={category.name}
                className="w-full h-32 object-cover mb-2" // Decreased height
              />
            )}
            <p className="text-md  font-semibold">{category.name}</p>
            <p className="text-gray-500">{category.tagline}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;

// components/BrowseCategories.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGrid, FiHeadphones, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BrowseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`bg-white py-4 ${isSticky ? 'fixed top-0 left-0 w-full z-50 shadow-lg' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="relative">
          <button
            className="bg-blue-500 text-white flex items-center px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FiGrid className="mr-2" size={24} />
            Browse All Categories
            <FiChevronDown className="ml-2" />
          </button>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bg-white shadow-md rounded-lg mt-2 w-48"
            >
              <ul>
                {categories.map((category) => (
                  <li key={category.id} className="px-4 py-2 hover:bg-gray-200">
                    {category.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        <div className="flex items-center text-blue-500">
          <FiHeadphones className="mr-2" size={24} />
          <div>
            <div className="font-bold">+92 312 8807795</div>
            <div className="text-gray-500">24/7 Support </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';

const fetchSubcategoriesByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`/api/subcategories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

const CategoryPage = ({ categoryData }) => {
  const { id } = useParams();
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      const data = await fetchSubcategoriesByCategoryId(id);
      setSubcategories(data);
    };

    if (id) {
      fetchSubcategories();
    }

    // Log the meta fields in the console
    console.log('Meta Title:', categoryData.meta_title || 'No Meta Title');
    console.log('Meta Description:', categoryData.meta_description || 'No Meta Description');
    console.log('Meta Keywords:', categoryData.meta_keywords || 'No Meta Keywords');
  }, [id, categoryData]);

  const handleSubcategoryClick = (subcategoryId) => {
    router.push(`/customer/pages/subcategories/${subcategoryId}`);
  };

  const backgroundColors = [
    'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-gray-100', 'bg-yellow-100'
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">{categoryData?.name} Subcategories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {subcategories.map((subcategory, index) => (
          <motion.div
            key={subcategory.id}
            className={`${backgroundColors[index % backgroundColors.length]} shadow-lg overflow-hidden text-center p-2 cursor-pointer`}
            onClick={() => handleSubcategoryClick(subcategory.id)}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: '200px' }}
          >
            {subcategory.imageUrl ? (
              <motion.img
                src={`https://data.tascpa.ca/uploads/${subcategory.imageUrl}`}
                alt={subcategory.name}
                className="w-full h-40 object-cover mb-2 rounded"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback-image.jpg';
                }}
              />
            ) : (
              <img
                src="/fallback-image.jpg"
                alt={subcategory.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <p className="text-lg font-normal">{subcategory.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

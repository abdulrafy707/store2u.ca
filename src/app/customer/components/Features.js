// components/Features.js
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FiTag, FiTruck, FiGift, FiGrid, FiRefreshCw } from 'react-icons/fi';

const features = [
  {
    icon: FiTag,
    title: 'Best prices & offers',
    description: 'Orders $50 or more',
  },
  {
    icon: FiTruck,
    title: 'Free delivery',
    description: '24/7 amazing services',
  },
  {
    icon: FiGift,
    title: 'Great daily deal',
    description: 'When you sign up',
  },
  {
    icon: FiGrid,
    title: 'Wide assortment',
    description: 'Mega Discounts',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy returns',
    description: 'Within 30 days',
  },
];

const Features = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <feature.icon className="text-blue-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

// components/TopBar.js
'use client';

import React from 'react';
import { FiChevronRight, FiPhone, FiFacebook, FiInstagram } from 'react-icons/fi';
import { FaTiktok, FaEnvelope } from 'react-icons/fa'; // Importing necessary icons
import { motion } from 'framer-motion';

const TopBar = () => {
  return (
    <div className="hidden w-full md:flex bg-white py-2 border-b border-gray-300 text-gray-800">
      <div className="container w-full flex flex-col md:flex-row justify-between items-center px-4">
        <div className="flex flex-col md:flex-row md:space-x-4 text-sm w-full ">
          <div className="flex space-x-4 mb-2 md:mb-0">
            <a href="/customer/pages/contactus" className="hover:underline">Contact Us </a>
            <span>/</span>
            <a href="/customer/pages/aboutus" className="hover:underline">About Us</a>
          </div>
          <div className="hidden md:block w-[70vw] overflow-x-hidden">
            <motion.div
              className="flex items-center space-x-2 text-gray-600 whitespace-nowrap"
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              <FiChevronRight />
              <span>Get great devices up to 50% off</span>
              <a href="#" className="text-blue-500 hover:underline">View details</a>
            </motion.div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-lg">
            <a href="https://www.facebook.com/profile.php?id=61557692016335" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FiFacebook className="text-blue-600" /> {/* Facebook Blue */}
            </a>
            <a href="mailto:info@store2u.ca" className="hover:text-red-500">
              <FaEnvelope className="text-red-600" /> {/* Red for Envelope */}
            </a>
            <a href="https://www.instagram.com/store2u.ca" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FiInstagram className="text-pink-500" /> {/* Instagram Pink */}
            </a>
            <a href="https://www.tiktok.com/@www.store2u.ca?lang=en" target="_blank" rel="noopener noreferrer" className="hover:text-black">
              <FaTiktok className="text-black" /> {/* TikTok Black */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

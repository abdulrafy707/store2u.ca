'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="relative max-w-full max-h-full">
        <motion.img
          src={imageUrl}
          alt="Zoomed"
          className="max-w-screen max-h-screen object-contain"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;

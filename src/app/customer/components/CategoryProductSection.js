'use client';

import React from 'react';

const CategoryProductSection = ({ categoryImage, products }) => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        <h3 className="text-xl text-gray-800 font-normal mt-4 text-center md:text-left">
          Upto 15% Sale!
        </h3>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Left Side: Category Image */}
          <div className="md:w-1/3 w-full md:pr-4 mb-4 md:mb-0 flex flex-col items-center md:items-start">
            <img
              src={categoryImage}
              alt="Category Image"
              className="w-full max-w-[350px] md:max-w-[380px] h-[200px] md:h-[300px] rounded-lg shadow-md object-cover"
            />
          </div>
          
          {/* Right Side: Product Cards */}
          <div className="md:w-2/3 w-full relative grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-300 relative h-[320px] flex-shrink-0"
              >
                {product.discount && (
                  <div className="absolute z-40 top-2 left-2 bg-red-500 text-white rounded-full h-8 w-16 flex items-center justify-center">
                    {product.discount}% OFF
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-[220px] w-full object-cover mb-4 rounded"
                />
                <div className="px-2">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    {product.discount ? (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 line-through">Rs.{product.originalPrice}</p>
                        <p className="text-sm font-semibold text-red-700">Rs.{product.price}</p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-700">Rs.{product.price}</p>
                    )}
                    <button className="bg-teal-500 text-white h-8 w-8 rounded-full flex justify-center items-center shadow-lg">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryProductSection;

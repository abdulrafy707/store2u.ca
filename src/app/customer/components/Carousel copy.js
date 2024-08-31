'use client';
import React from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const slides = [
  {
    image: '/s1.jpg',
    title: 'Welcome to Our E-commerce Store',
    description: 'Discover a variety of products at unbeatable prices. Shop now and enjoy a seamless online shopping experience with us!'
  },
  {
    image: '/s2.jpg',
    title: 'Quality Products for You',
    description: 'Find high-quality products that meet your needs and preferences. Your satisfaction is our priority!'
  },
  {
    image: '/s3.jpg',
    title: 'Special Discounts Available',
    description: 'Don\'t miss out on our special discounts and offers. Save more with every purchase!'
  }
];

function Slider() {
  return (
    <div className="relative slide-container text-black" style={{ height: '400px' }}>
      <Zoom scale={0.4} duration={2000} autoPlay={true}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full">
            <img src={slide.image} className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none bg-black bg-opacity-50">
              <h1 className='text-4xl font-bold text-white pb-3'>{slide.title}</h1>
              <p className='w-[680px] mx-auto pb-10 text-center text-white'>{slide.description}</p>
            </div>
          </div>
        ))}
      </Zoom>
    </div>
  );
}

export default Slider;

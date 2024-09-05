// components/Footer.js

import React from "react";
import { RxGlobe } from "react-icons/rx";
import { MdKeyboardArrowDown, MdCopyright } from "react-icons/md";
import { FaFacebook, FaEnvelope, FaTiktok, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <div className="grid grid-cols-1 px-4 gap-2 md:px-10 lg:px-20 sm:grid-cols-3 md:grid-cols-10 py-16 border-t-2 border-b-2 text-black lg:grid-cols-10">
        <div className="flex flex-col gap-2 col-span-4">
          <Link href="/" legacyBehavior>
            <a className="focus:outline-none">
              <img src="/store2ulogo.png" className="cursor-pointer w-[300px]  " alt="Store2u Logo" />
            </a>
          </Link>
          <p className="text-[15px] font-[400] md:mr-10 sm:mr-10 lg:mr-10 xl:mr-10 text-justify">
            Store2u is your ultimate destination for top-quality products, seamless shopping experience, and unmatched customer service. Discover a wide range of items to meet all your needs.
          </p>
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Company</p>
          
          <Link href="/customer/pages/privacypolicy" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Privacy Policy</p>
            </a>
          </Link>
          <Link href="/customer/pages/termsandconditions" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Terms & Conditions</p>
            </a>
          </Link>
          <Link href="/customer/pages/shippingpolicy" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Shipping Policy</p>
            </a>
          </Link>
          <Link href="/customer/pages/returnandexchangepolicy" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Return & Exchange Policy</p>
            </a>
          </Link>
          
          
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Explore</p>
          
          <Link href="/customer/pages/aboutus" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">About Us</p>
            </a>
          </Link>
          <Link href="/customer/pages/faq" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">FAQs</p>
            </a>
          </Link>
          <Link href="/customer/pages/contactus" legacyBehavior>
            <a className="hover:no-underline">
              <p className="text-[15px] font-[400]">Contact Us</p>
            </a>
          </Link>
          
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-[20px] font-[600]">Support</p>
          
          
          <p className="text-[15px] font-[400]">Email: info@store2u.ca</p>
          <p className="text-[15px] font-[400]">Phone: +92310356111</p>
          <p className="text-[15px] font-[400]">Address: <br></br>Garden Town, House No 15C street No. 12, Gojra, Toba Tek Singh</p>
        </div>
      </div>

      <div className="flex justify-around items-center flex-wrap-reverse p-8 gap-6 text-black">
        <div className="flex items-center gap-1 border-2 p-2">
          <RxGlobe className="text-[25px]" />
          <p>English (United States)</p>
          <MdKeyboardArrowDown className="text-[25px]" />
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1">
            <MdCopyright />
            <p>2024 All Rights Reserved</p>
          </div>
          <p>Privacy policy | Terms</p>
        </div>
        <div className="flex gap-[6px] w-[250px] justify-center">
      <a href="https://www.facebook.com/profile.php?id=61557692016335" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="h-8 w-8 text-blue-600 hover:text-blue-800" />
      </a>
      <a href="mailto:info@store2u.ca">
        <FaEnvelope className="h-8 w-8 text-gray-600 hover:text-gray-800" />
      </a>
      <a href="https://www.tiktok.com/@www.store2u.ca?lang=en" target="_blank" rel="noopener noreferrer">
        <FaTiktok className="h-8 w-8 text-black hover:text-gray-800" />
      </a>
      
      <a href="https://www.instagram.com/store2u.ca" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="h-8 w-8 text-pink-600 hover:text-pink-800" />
      </a>
    </div>
      </div>
    </>
  );
};

export default Footer;
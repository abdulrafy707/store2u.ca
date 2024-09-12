'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Store2U?",
      answer: "Store2U is an online shopping platform that offers a wide range of high-quality products at competitive prices. Our mission is to provide the best online shopping experience with exceptional customer service."
    },
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our product catalog, add items to your cart, and proceed to checkout. You will need to provide your shipping details and payment information to complete the purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, debit cards, and PayPal. All transactions are securely processed to ensure your safety."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order has been shipped, you will receive a confirmation email with a tracking number. You can use this number to track your order on our website or the carrier's website."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most products. Items must be unused, in the same condition that you received them, and in the original packaging. Please contact our customer support team to initiate a return."
    },
    // {
    //   question: "How do I contact customer support?",
    //   answer: "You can reach our customer support team via email at support@store2u.com or by phone at +92 312 8807795. We are available Monday to Friday from 9 AM to 6 PM."
    // },
    // {
    //   question: "Do you offer international shipping?",
    //   answer: "Yes, we offer international shipping to many countries. Shipping rates and delivery times vary based on the destination. Please check our shipping policy for more details."
    // },
    // {
    //   question: "Can I change or cancel my order?",
    //   answer: "If you need to change or cancel your order, please contact our customer support team as soon as possible. We will do our best to accommodate your request, but please note that orders that have already been shipped cannot be modified or canceled."
    // },
    // {
    //   question: "Do you have a physical store?",
    //   answer: "No, Store2U operates exclusively online to offer you the best prices and convenience. You can shop with us anytime, anywhere."
    // },
    // {
    //   question: "What are your shipping rates?",
    //   answer: "Shipping rates vary based on the destination and the weight of the package. You can view the shipping cost at checkout before completing your purchase."
    // }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-8 md:mb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 p-4 sm:p-10 md:p-0">Frequently<br /> Asked Questions</h2>
        </div>
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {faqs.map((faq, index) => (
            <div key={index} className={`p-4 border-b ${activeIndex === index ? 'bg-gray-100' : ''}`}>
              <div 
                className="flex items-center cursor-pointer justify-between" 
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-base sm:text-lg font-medium text-gray-800 flex-1">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="text-gray-600 ml-4" />
                ) : (
                  <FiChevronDown className="text-gray-600 ml-4" />
                )}
              </div>
              <div className={`overflow-hidden transition-all duration-500 ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}>
                <p className="mt-4 text-sm sm:text-base text-gray-700">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;

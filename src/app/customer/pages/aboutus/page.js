// pages/about.js
import React from 'react';
import Head from 'next/head';

const About = () => {
  return (
    <>
      <Head>
        <title>About Us - Store2U</title>
        <meta name="description" content="Learn more about Store2U, our mission, and our team." />
      </Head>
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At Store2U, our mission is to provide customers with the best online shopping experience possible. We strive to offer a wide range of high-quality products at competitive prices, along with exceptional customer service.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed">
                Store2U was founded by a team of passionate individuals who wanted to make online shopping easier and more accessible for everyone. Our team is dedicated to continuously improving our platform and expanding our product offerings to meet the diverse needs of our customers.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
              <p className="text-gray-600 leading-relaxed">
                Our team is comprised of experienced professionals from various backgrounds, including technology, retail, and customer service. We work together to ensure that Store2U remains a trusted and reliable source for all your shopping needs.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions, feedback, or concerns, please don't hesitate to reach out to us. You can contact our customer support team at <a href="mailto:support@store2u.com" className="text-blue-500 hover:underline">support@store2u.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

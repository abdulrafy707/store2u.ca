// pages/contact.js
import React from 'react';
import Head from 'next/head';

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact Us - Store2U</title>
        <meta name="description" content="Get in touch with Store2U. We would love to hear from you!" />
      </Head>
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We would love to hear from you! If you have any questions, feedback, or concerns, please reach out to us using the contact information below or fill out the form.
              </p>
            </section>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Email:</strong> <a href="mailto:support@store2u.com" className="text-blue-500 hover:underline">support@store2u.com</a><br />
                <strong>Phone:</strong> <a href="tel:+923128807795" className="text-blue-500 hover:underline">+92 312 8807795</a><br />
                <strong>Address:</strong> Garden Town, House No 15C street No. 12, Gojra, Toba Tek Singh
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Form</h2>
              <form className="space-y-4" action="/">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700">Message</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">Send Message</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

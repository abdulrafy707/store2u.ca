'use client'
import React, { useState } from 'react';
import Head from 'next/head';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <strong>Address:</strong> PO Chak No. 356/jb Khalsa Abad, Tehseil Gojra,District Toba Tek Singh, Punjab, Pakistan
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Form</h2>
              {success && <p className="text-green-500 mb-4">{success}</p>}
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                </div>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;

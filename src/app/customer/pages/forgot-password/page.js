'use client'
// src/app/auth/forgot-password/page.js

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success(data.message || 'Email sent successfully!');
    } else {
      toast.error(data.message || 'Something went wrong. Please try again.');
    }

    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer /> {/* Toast Container for displaying toasts */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <img className="w-24" src="/store2ulogo.png" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-500">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

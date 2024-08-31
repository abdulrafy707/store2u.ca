// app/orderInfo/page.js
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const OrderInfoPage = () => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [orderId, setOrderId] = useState(null); // Optional: Use if you need to link order with this info
  const router = useRouter();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderInfo = {
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      orderId,
    };

    try {
      await axios.post('/api/orderInfo', orderInfo); // Save order info in the database
      alert('Order placed successfully!');
      router.push('/'); // Redirect to the homepage or any other page
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handlePlaceOrder}>
        <h2 className="text-2xl font-bold mb-6">Order Information</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Shipping Address</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Delivery Method</label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderInfoPage;

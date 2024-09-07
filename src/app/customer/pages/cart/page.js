'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { removeFromCart, updateQuantity, setCart } from '@/app/store/cartSlice';

const CartPage = () => {
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);  
  const [deliveryCharge, setDeliveryCharge] = useState(0); // Set initial value to 0

  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch delivery charge (assuming you have an API for this)
  const fetchDeliveryCharge = async () => {
    try {
      const response = await fetch('/api/settings/getSetting'); // Replace with actual endpoint
      const data = await response.json();
      setDeliveryCharge(data.deliveryCharge || 0); // Fallback to 0 if not provided
    } catch (error) {
      console.error('Error fetching delivery charge:', error);
      setDeliveryCharge(0);
    }
  };

  // Load the cart from sessionStorage/localStorage and sync Redux state
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));
    fetchDeliveryCharge(); // Fetch delivery charge
    calculateTotal(storedCart);
  }, [dispatch]);

  // Recalculate total whenever the cart or delivery charge changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      calculateTotal(cart);
    }
  }, [cart, deliveryCharge]);

  const calculateTotal = (cartItems) => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal + deliveryCharge); // Include delivery charge in total
  };

  // Update item quantity in the cart
  const updateItemQuantity = (itemId, quantity) => {
    dispatch(updateQuantity({ id: itemId, quantity }));
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: quantity } : item
    );
    calculateTotal(updatedCart);
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart({ id: itemId }));
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    toast.success('Product removed from cart!');
  };

  const handleCheckout = () => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    router.push(`/customer/pages/checkout?total=${total}`);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
        <div className="w-32 h-32 mb-4">
          <img
            src="/cart.png"
            alt="Empty Cart"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-2xl font-bold text-gray-800">
          Your Cart is <span className="text-red-600">Empty!</span>
        </p>
        <button
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md shadow-md"
          onClick={() => router.push('/')}
        >
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  return (
    <div className="container text-black bg-white mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 border border-gray-300 rounded p-4">
          <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
          <div className="flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`https://data.tascpa.ca/uploads/${item.images[0].url}`}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 mr-4">
                    No Image
                  </div>
                )}
                <div className="flex-grow">
                  <div className='flex justify-between items-center w-full'>
                    <h3 className="text-md font-semibold">{item.name}</h3>
                    <p className="text-md font-medium text-gray-700">Rs.{item.price}</p>
                  </div>
                  <p className="text-md font-medium text-gray-700">Size: {item.selectedSize || 'N/A'}</p>
                  <p className="text-md font-medium text-gray-700">Color: {item.selectedColor || 'N/A'}</p>
                  <div className="flex items-center justify-end mt-2">
                    <button
                      className="pr-4 underline"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      remove
                    </button>
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
                      <button
                        className="text-gray-700 px-2"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-4">{item.quantity}</span>
                      <button
                        className="text-gray-700 px-2"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-2/5 border rounded border-gray-300 p-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-xl font-bold text-gray-700">Subtotal:</p>
              <p className="text-md text-gray-700">Rs.{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Delivery Charge:</p>
              <p className="text-md text-gray-700">Rs.{deliveryCharge.toFixed(2)}</p>
            </div>
            <hr className="h-2"></hr>
            <div className="flex justify-between">
              <p className="text-xl font-bold text-gray-700">Total:</p>
              <p className="text-md text-gray-700">Rs.{total.toFixed(2)}</p>
            </div>
            <button
              className="bg-teal-500 text-white py-2 px-4 rounded-md mt-4 w-full"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartPage;

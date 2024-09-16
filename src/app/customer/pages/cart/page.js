'use client';
import Link from 'next/link';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiMinus } from 'react-icons/fi';
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
        
        {/* Left Section - Cart Items & Shipping Information */}
        <div className="w-full lg:w-3/5 border border-gray-300 rounded">

          {/* Shipping Information Section */}
          <div className="bg-blue-50 w-full h-[100px]    mb-6">
            <div className="flex items-center space-x-4">
              <img src="/shipping-icon.png" alt="Shipping Icon" className="h-14 w-17 pl-4" />
              <div>
                <p className="text-lg font-semibold pl-4 pt-4 text-gray-800">
                  Shipping, arrives today, Sep 2
                </p>
                <p className="text-md pl-4 text-gray-600">
                  Order within <span className="font-bold">5 hr 33 min</span>
                </p>
                <p className="text-md pl-4 text-blue-600 underline cursor-pointer">95829</p> {/* Example ZIP code */}
              </div>
            </div>
          </div>

          {/* Cart Products */}
          {/* <h2 className="text-2xl pl-4 font-semibold">Your Cart</h2> */}
          <div className="flex flex-col p-4 pt-2 gap-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white  flex items-start pl-1 pt-4 mt-0 justify-between border-b border-gray-300">
                {/* Product Information */}
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`https://data.tascpa.ca/uploads/${item.images[0].url}`}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded mr-4 "
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 mr-4">
                    No Image
                  </div>
                )}
                <div className="flex-grow pr-4">
                  <div className='flex justify-between items-center w-full'>
                  <h3 className="text-sm text-gray-600 ">{item.name.toUpperCase()}</h3>

                    <p className="text-md font-bold text-black">Rs.{item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-normal text-gray-600">Size: {item.selectedSize || 'N/A'}</p>
                  <p className="text-sm font-normal text-gray-600">Color: {item.selectedColor || 'N/A'}</p>
                  <div className="flex items-center justify-end mt-2">
                    <button
                      className="pr-4 pb-4 underline"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      remove
                    </button>
                    <div className='pb-4'>
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
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full lg:w-2/5 p-4">
  <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded-full w-full text-lg font-semibold"
      onClick={handleCheckout}
    >
      Continue to checkout
    </button>
    <p className="text-center text-gray-500 mt-2">
      For the best shopping experience, 
      <Link href="/customer/pages/register" className="text-blue-500 underline cursor-pointer">
        sign in
      </Link>
    </p>
    <hr className="my-4" />
    <div className="flex justify-between">
      <p className="text-md font-semibold text-gray-700">Subtotal (1 item):</p>
      <p className="text-md text-gray-700">Rs.{Math.round(subtotal).toLocaleString()}</p>

    </div>
    <hr className="my-4" />
    <div className="flex justify-between">
      <p className="text-md font-semibold text-gray-700">Estimated total:</p>
      <p className="text-md text-gray-700">Rs.{Math.round(total).toLocaleString()}</p>

    </div>
  </div>
</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartPage;

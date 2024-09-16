'use client';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiShoppingCart, FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, setCart } from '@/app/store/cartSlice';

export default function WhatsAppButton() {
  const phoneNumber = '923310356111';
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [cartVisible, setCartVisible] = useState(false);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=Hello%Store2u`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));
  }, [dispatch]);

  const updateItemQuantity = (itemId, quantity) => {
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = storedCart.find(item => item.id === itemId);

    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(storedCart));
      dispatch(updateQuantity({ id: itemId, quantity }));
    }
  };

  const handleRemoveFromCart = (itemId) => {
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    storedCart = storedCart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(storedCart));
    dispatch(removeFromCart({ id: itemId }));
    alert(`Product removed from cart!`);
  };

  return (
    <>
      <div className="fixed bottom-4 text-black right-4 flex flex-col space-y-4 items-center z-50">
        {/* Cart Button */}
        <button
          onClick={() => setCartVisible(true)}
          className="bg-teal-500 text-white p-3 rounded-full shadow-lg">
          <FiShoppingCart className="h-6 w-6 " />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cart.length}</span>
          )}
        </button>
        {/* WhatsApp Button */}
        <div
          className="shadow-lg cursor-pointer flex items-center justify-center bg-green-500 p-2 rounded-full mb-4"
          onClick={handleClick}>
          <FaWhatsapp className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>

        
      </div>

      {cartVisible && (
        <div className="fixed md:h-full h-[80vh] overflow-y-auto md:m-0 m-4  inset-0 text-black bg-gray-900 bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full lg:w-1/3 h-full p-4 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button onClick={() => setCartVisible(false)}>
                <FiX className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-8">Your cart is empty</div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center mb-4">
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
                  <h3 className="text-md ">{item.name.toUpperCase()}</h3>

                    <p className="text-md font-medium text-gray-700">Rs.{item.price.toLocaleString()}</p>
                    <div className="flex items-center">
                      <button
                        className="bg-gray-300 text-gray-700 px-2 rounded-md"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="bg-gray-300 text-gray-700 px-2 rounded-md"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-md"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            )}
            {cart.length > 0 && (
              <div className="mt-6">
                <p className="text-md font-medium text-gray-700">Subtotal: Rs.{total}</p>
                <a href='/customer/pages/cart'>
                <button
                  className="bg-teal-500 text-white py-2 px-4 rounded-md mt-4 w-full"
                >
                  View Cart
                </button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

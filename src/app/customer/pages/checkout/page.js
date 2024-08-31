'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiUser, FiHome, FiMapPin, FiPhone, FiMail, FiCreditCard, FiCalendar, FiLock, FiTag } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
// Modal.setAppElement('#__next'); // or whatever your root element ID is

const CheckoutPage = () => {
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: '',
    streetAddress: '',
    apartmentSuite: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phoneNumber: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [extraDeliveryCharge, setExtraDeliveryCharge] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    setTotal(storedCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0));

    fetchSettings();

    // Fetch extra delivery charge if the default payment method is 'Cash on Delivery'
    if (paymentMethod === 'Cash on Delivery') {
      fetchExtraDeliveryCharge();
    }
  }, [paymentMethod]); // Add paymentMethod as a dependency to trigger fetchExtraDeliveryCharge on change

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings/getSettings');
      const { deliveryCharge, taxPercentage, extraDeliveryCharge } = response.data;
      setDeliveryCharge(deliveryCharge);
      setTaxRate(taxPercentage / 100);
      setExtraDeliveryCharge(extraDeliveryCharge || 0);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchExtraDeliveryCharge = async () => {
    try {
      const response = await axios.get('/api/settings/getSettings');
      const { other1 } = response.data; 
      setExtraDeliveryCharge(other1);
    } catch (error) {
      console.error('Error fetching extra delivery charge:', error);
      setExtraDeliveryCharge(0);
    }
  };

  const calculateTotal = () => {
    const subtotalAfterDiscount = total - discount;
    const tax = subtotalAfterDiscount * taxRate;
    const additionalCharge = paymentMethod === 'Cash on Delivery' ? extraDeliveryCharge : 0;
    return subtotalAfterDiscount + tax + deliveryCharge + additionalCharge;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Cash on Delivery') {
      fetchExtraDeliveryCharge();
    } else {
      setExtraDeliveryCharge(0);
    }
  };

  const validateForm = () => {
    const {
      recipientName,
      streetAddress,
      city,
      state,
      zip,
      country,
      phoneNumber,
      email
    } = shippingAddress;

    if (
      !recipientName ||
      !streetAddress ||
      !city ||
      !state ||
      !zip ||
      !country ||
      !phoneNumber ||
      !email
    ) {
      alert('Please fill in all required shipping address fields.');
      return false;
    }

    if (paymentMethod === 'Credit Card') {
      const { cardNumber, cardName, expiryDate, cvv } = paymentInfo;
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert('Please fill in all required credit card information.');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }
  
    let userId = null;
  
    try {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          userId = decoded.id;
        } else {
          sessionStorage.removeItem('authToken');
          router.push('/customer/pages/login');
          return;
        }
      }
  
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));
  
      const orderDetails = {
        userId,
        shippingAddress,
        paymentMethod,
        paymentInfo: paymentMethod === 'Credit Card' ? paymentInfo : null,
        items: orderItems,
        total: calculateTotal(),
        discount,
        tax: (total - discount) * taxRate,
        netTotal: calculateTotal(),
        couponCode,
      };
  
      console.log('Order details:', orderDetails); // Debug: Log order details
  
      const response = await axios.post('/api/orders', orderDetails, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
  
      console.log('Order response:', response.data); // Debug: Log response data
  
      if (response.data.status) {
        console.log('Setting isModalOpen to true');
        setIsModalOpen(true); // Open the success modal
  
        // Clear the cart in local storage and state
        localStorage.removeItem('cart');
        setCart([]);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  
  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post('/api/coupons/validate', { code: couponCode });
      const data = response.data;
  
      if (data.valid) {
        const discountAmount = (total * data.discountPercentage) / 100;
        setDiscount(discountAmount);
        setCouponMessage(`Coupon applied! You get a discount of ${data.discountPercentage}% (Rs.${discountAmount.toFixed(2)})`);
      } else {
        setDiscount(0);
        setCouponMessage(data.message);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setDiscount(0);
      setCouponMessage('Failed to validate coupon');
    }
  };
  

  return (
    <div className="container text-black bg-white mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border p-4">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <div className="mb-4 relative">
            <FiUser className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Recipient Name"
              value={shippingAddress.recipientName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, recipientName: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Street Address"
              value={shippingAddress.streetAddress}
              onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiHome className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Apartment/Suite Number"
              value={shippingAddress.apartmentSuite}
              onChange={(e) => setShippingAddress({ ...shippingAddress, apartmentSuite: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="State/Province/Region"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Postal/ZIP Code"
              value={shippingAddress.zip}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiPhone className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="text"
              placeholder="Phone Number"
              value={shippingAddress.phoneNumber}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 relative">
            <FiMail className="absolute left-3 top-3 text-gray-500 font-bold" />
            <input
              type="email"
              placeholder="Email Address"
              value={shippingAddress.email}
              onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
              className="w-full pl-10 px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="border p-4">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Subtotal:</p>
              <p className="text-xl text-gray-700">Rs.{total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Discount ({((discount / total) * 100).toFixed(2)}%):</p>
              <p className="text-md text-gray-700">- Rs.{discount.toFixed(2)}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Subtotal after Discount:</p>
              <p className="text-md text-gray-700">Rs.{(total - discount).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Tax ({(taxRate * 100).toFixed(2)}%):</p>
              <p className="text-md text-gray-700">Rs.{((total - discount) * taxRate).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-md font-medium text-gray-700">Delivery Charges:</p>
              <p className="text-md text-gray-700">Rs.{deliveryCharge.toFixed(2)}</p>
            </div>
            {paymentMethod === 'Cash on Delivery' && (
              <div className="flex justify-between">
                <p className="text-md font-medium text-gray-700">Cash On Delivery Charges:</p>
                <p className="text-md text-gray-700">Rs.{extraDeliveryCharge.toFixed(2)}</p>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="text-xl font-bold text-gray-700">Total:</p>
              <p className="text-xl text-gray-700">Rs.{calculateTotal().toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Coupon Code</h2>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <FiTag className="absolute right-3 text-gray-500 font-bold" />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full" onClick={handleApplyCoupon}>
              Apply Coupon
            </button>
            {couponMessage && (
              <p className="text-green-500 mt-2">{couponMessage}</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              <label htmlFor="cod" className="ml-2">Cash on Delivery</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="Credit Card"
                checked={paymentMethod === 'Credit Card'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
              <label htmlFor="creditCard" className="ml-2">Credit Card</label>
            </div>
          </div>

          {paymentMethod === 'Credit Card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiCreditCard className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Card Name"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiUser className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="Expiry Date"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiCalendar className="absolute right-3 text-gray-500 font-bold" />
              </div>
              <div className="mb-4 relative flex items-center">
                <input
                  type="text"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md pr-10"
                  required
                />
                <FiLock className="absolute right-3 text-gray-500 font-bold" />
              </div>
            </div>
          )}

          <button className="bg-teal-500 text-white py-2 px-4 rounded-md mt-8 w-full" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Order Success"
  style={{
    overlay: {
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      zIndex: 10001,
      margin: 'auto',
      width: 'fit-content',
      height: 'fit-content',
      padding: '20px',
      textAlign: 'center'
    }
  }}
>
  <div className="flex flex-col items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-12 h-12 text-green-500 mb-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7-1a9 9 0 11-6-8.71" />
    </svg>
    <h2 className="text-xl font-semibold mb-4">Order Placed Successfully!</h2>
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded-md"
      onClick={() => {
        setIsModalOpen(false);
        router.push('/');
      }}
    >
      OK
    </button>
  </div>
</Modal>



    </div>
  );
};

export default CheckoutPage;

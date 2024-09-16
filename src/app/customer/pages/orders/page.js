'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import { EyeIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [extraDeliveryCharge, setExtraDeliveryCharge] = useState(0); // Added extra delivery charge state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings/getSettings');
        const { deliveryCharge, taxPercentage } = response.data;
        setDeliveryCharge(deliveryCharge);
        setTaxRate(taxPercentage / 100);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    const fetchExtraDeliveryCharge = async () => {
      try {
        const response = await axios.get('/api/settings/getSettings');
        const { other1 } = response.data; // Fetch the extra delivery charge from the settings
        setExtraDeliveryCharge(other1);
      } catch (error) {
        console.error('Error fetching extra delivery charge:', error);
        setExtraDeliveryCharge(0);
      }
    };

    const fetchOrders = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('You need to log in to view your orders');
        router.push('/customer/pages/login');
        return;
      }

      try {
        const response = await axios.get('/api/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchExtraDeliveryCharge(); // Fetch extra delivery charge
    fetchOrders();
  }, [router]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'CANCELLED') return;

    try {
      setLoading(true);
      const response = await axios.put(`/api/orders/${selectedOrder.id}`, {
        id: selectedOrder.id,
        status: 'CANCELLED',
      });

      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.map(order => order.id === selectedOrder.id ? { ...order, status: 'CANCELLED' } : order));
        setSelectedOrder((prevOrder) => ({ ...prevOrder, status: 'CANCELLED' }));
        setIsConfirmModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert('Failed to cancel order. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots
          height={80}
          width={80}
          color="#3498db"
          ariaLabel="circle-loading"
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const statusClasses = {
    PENDING: 'bg-gray-300 text-gray-700',
    PAID: 'bg-gray-300 text-gray-700',
    SHIPPED: 'bg-gray-300 text-gray-700',
    COMPLETED: 'bg-gray-300 text-gray-700',
    CANCELLED: 'bg-gray-300 text-gray-700',
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow rounded-lg p-4">
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const subtotal = order.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
                  const subtotalLessDiscount = subtotal - (order.discount ?? 0);
                  const totalTax = subtotalLessDiscount * taxRate;
                  const total = subtotalLessDiscount + totalTax + deliveryCharge + (order.extraDeliveryCharge ?? extraDeliveryCharge); // Include extra delivery charge

                  const productNames = (
                    <ul className="list-disc list-inside">
                      {order.orderItems.map(item => (
                        <li key={item.id} className="text-gray-700">{item.product.name}</li>
                      ))}
                    </ul>
                  );
                  
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {order.orderItems.map(item => (
    <li key={item.id} className="text-gray-700">{item.product.name.toUpperCase()}</li>
  ))}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  Rs.{total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl h-[90vh] w-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details - #{selectedOrder.id}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="mb-2"><strong>Status:</strong> {selectedOrder.status}</p>
              <p className="mb-2"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              <h3 className="font-semibold mt-4">Items:</h3>
              <div className="flex flex-col gap-4">
  {selectedOrder.orderItems.map((item) => (
    <div key={item.id} className="bg-white flex items-start justify-between p-4 border-b border-gray-300">
      {/* Product Image */}
      {item.product.images && item.product.images.length > 0 ? (
        <img
          src={`https://data.tascpa.ca/uploads/${item.product.images[0].url}`}
          alt={item.product.name}
          className="h-20 w-20 object-cover rounded mr-4"
        />
      ) : (
        <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 mr-4">
          No Image
        </div>
      )}
      
      {/* Product Information */}
      <div className="flex-grow pr-4">
        <div className='flex justify-between items-center w-full'>
        <h3 className="text-md font-semibold text-gray-600">{item.product.name.toUpperCase()}</h3>

        <p className="text-md font-bold text-gray-600">Rs.{item.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>


        </div>
        <p className="text-sm font-normal text-gray-600">Size: {item.selectedSize || 'N/A'}</p>
        <p className="text-sm font-normal text-gray-600">Color: {item.selectedColor || 'N/A'}</p>
      </div>

      {/* Remove and Quantity Controls */}
      <div className="flex flex-col items-end space-y-2">
        {/* <button
          className="text-blue-500 underline"
          onClick={() => handleRemoveFromCart(item.id)}
        >
          remove
        </button> */}
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-1">
          <button
            className="text-gray-700 px-2"
            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            {/* <FiMinus /> */}
          </button>
          <span className="mx-4">{item.quantity}</span>
          <button
            className="text-gray-700 px-2"
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            {/* <FiPlus /> */}
          </button>
        </div>
      </div>
    </div>
  ))}
</div>



              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const subtotal = selectedOrder.orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
                  const subtotalLessDiscount = subtotal - (selectedOrder.discount ?? 0);
                  const totalTax = subtotalLessDiscount * taxRate;
                  const total = subtotalLessDiscount + totalTax + deliveryCharge + (selectedOrder.extraDeliveryCharge ?? extraDeliveryCharge); // Include extra delivery charge

                  return (
                    <>
                      <div className="flex justify-between">
  <p className="text-md font-medium text-gray-700">Subtotal:</p>
  <p className="text-xl text-gray-700">Rs.{subtotalLessDiscount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
</div>
<div className="flex justify-between">
  <p className="text-md font-medium text-gray-700">Delivery Charges:</p>
  <p className="text-md text-gray-700">Rs.{deliveryCharge.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
</div>
<div className="flex justify-between">
  <p className="text-md font-medium text-gray-700">Cash on Delivery Charge:</p>
  <p className="text-md text-gray-700">Rs.{(selectedOrder.extraDeliveryCharge ?? extraDeliveryCharge).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
</div>
<hr className="my-2" />
<div className="flex justify-between mt-4">
  <p className="text-xl font-bold text-gray-700">Total:</p>
  <p className="text-xl text-gray-700">Rs.{total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
</div>

                    </>
                  );
                })()}
              </div>
              <div className="mt-4 flex space-x-2">
                {Object.keys(statusClasses).map((status) => (
                  <span
                    key={status}
                    className={`px-4 py-2 rounded-full text-xs font-semibold ${
                      selectedOrder.status === status ? 'bg-green-500 text-white' : statusClasses[status]
                    }`}
                  >
                    {status}
                  </span>
                ))}
              </div>
              {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'PAID') && (
                <div className="mt-4">
                  <button
                    onClick={handleConfirmCancel}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel this order?</h3>
            <div className="flex justify-end space-x-4">
              <button onClick={closeConfirmModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">No</button>
              <button onClick={handleCancelOrder} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-4">Your order has been canceled successfully.</h3>
            <button onClick={closeSuccessModal} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;

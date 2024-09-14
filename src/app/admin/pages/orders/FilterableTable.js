'use client'
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const FilterableTable = ({ data = [], fetchData }) => {  // Ensure data defaults to an empty array
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    id: null,
    userId: '',
    total: '',
    status: '',
    orderItems: [],
    image: null,
  });

  const router = useRouter();

  useEffect(() => {
    if (Array.isArray(data)) {  // Check if data is an array
      setFilteredData(
        data
          .filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(filter.toLowerCase())
            )
          )
          .sort((a, b) => {
            // Define the order with pending on top and cancelled/completed at the bottom
            const statusOrder = ['PENDING','SHIPPED', 'PAID',   'CANCELLED','COMPLETED'];
            
            // Compare based on the status order
            const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  
            if (statusComparison !== 0) {
              return statusComparison; // Sort by status if statuses are different
            }
  
            // For the same status, sort by updatedAt (latest orders first)
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          })
      );
    }
  }, [filter, data]);
  

  const handleRowClick = (id) => {
    router.push(`/admin/pages/orders/${id}`);
  };

  const handleAddNewItem = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('userId', newItem.userId);
    formData.append('total', newItem.total);
    formData.append('status', newItem.status);
    newItem.orderItems.forEach((item, index) => {
      formData.append(`orderItems[${index}][productId]`, item.productId);
      formData.append(`orderItems[${index}][quantity]`, item.quantity);
      formData.append(`orderItems[${index}][price]`, item.price);
    });
    if (newItem.image) {
      formData.append('image', newItem.image);
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      fetchData(); // Refresh the data after adding
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchData(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Orders List</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => {
                setNewItem({
                  id: null,
                  userId: '',
                  total: '',
                  status: '',
                  orderItems: [],
                  image: null,
                });
                setIsModalOpen(true);
              }}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
  {Array.isArray(filteredData) && filteredData.map((item, index) => (
    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.user ? (
          <>
            {item.user.name}<br />(ID: {item.userId})
          </>
        ) : (
          <>No User Associated</>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paymentMethod}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleRowClick(item.id); }}
          className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out">Open
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newItem.id ? 'Edit Order' : 'Add New Order'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <input
                type="number"
                value={newItem.userId}
                onChange={(e) => setNewItem({ ...newItem, userId: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                value={newItem.total}
                onChange={(e) => setNewItem({ ...newItem, total: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <input
                type="text"
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Order Items</label>
              {newItem.orderItems.map((orderItem, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="number"
                    placeholder="Product ID"
                    value={orderItem.productId}
                    onChange={(e) => {
                      const updatedOrderItems = [...newItem.orderItems];
                      updatedOrderItems[index].productId = e.target.value;
                      setNewItem({ ...newItem, orderItems: updatedOrderItems });
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={orderItem.quantity}
                    onChange={(e) => {
                      const updatedOrderItems = [...newItem.orderItems];
                      updatedOrderItems[index].quantity = e.target.value;
                      setNewItem({ ...newItem, orderItems: updatedOrderItems });
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={orderItem.price}
                    onChange={(e) => {
                      const updatedOrderItems = [...newItem.orderItems];
                      updatedOrderItems[index].price = e.target.value;
                      setNewItem({ ...newItem, orderItems: updatedOrderItems });
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                onClick={() => setNewItem({ ...newItem, orderItems: [...newItem.orderItems, { productId: '', quantity: '', price: '' }] })}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Add Item
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewItem}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {newItem.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;

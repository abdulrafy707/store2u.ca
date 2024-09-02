import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import 'react-tabs/style/react-tabs.css';

const FilterableCustomerTable = ({ customers, fetchCustomers }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(customers || []);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phoneno: '',
    city: '',
    role: 'CUSTOMER',
    image: null, // Image file
    imageUrl: '', // Image URL
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      (customers || []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, customers]);

  const handleAddNewItem = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.password || !newCustomer.phoneno || !newCustomer.city) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      let imageUrl = '';
      if (images.length > 0) {
        const imageBase64 = await convertToBase64(images[0]);
        const response = await fetch('https://data.tascpa.ca/uploadImage.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          imageUrl = result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }

      const customerToSubmit = {
        ...newCustomer,
        imageUrl,
      };

      const response = newCustomer.id 
        ? await fetch(`/api/users/${newCustomer.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerToSubmit),
          })
        : await fetch(`/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerToSubmit),
          });

      if (response.ok) {
        fetchCustomers(); // Refresh the data after adding/updating
        setIsModalOpen(false);
        setNewCustomer({
          id: null,
          name: '',
          email: '',
          password: '',
          phoneno: '',
          city: '',
          role: 'CUSTOMER',
          image: null,
          imageUrl: '',
        });
        setImages([]);
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update customer:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating customer:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchCustomers(); // Refresh the data after deleting
      } else {
        console.error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = async (item) => {
    setIsLoading(true);
    try {
      setNewCustomer(item);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (id, action) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        fetchCustomers(); // Refresh the data after status change
      } else {
        const errorData = await response.json();
        console.error('Failed to update customer status:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
    setIsLoading(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImages([file]);
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
          <h2 className="text-xl font-semibold text-gray-800">Customers List</h2>
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
                setNewCustomer({
                  id: null,
                  name: '',
                  email: '',
                  password: '',
                  phoneno: '',
                  city: '',
                  role: 'CUSTOMER',
                  image: null,
                  imageUrl: '',
                });
                setImages([]);
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
          <table className="min-w-full divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email varification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phoneno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.emailVerified}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.verificationToken}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.updatedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, item.status === 1 ? 'deactivate' : 'activate')}
                      className={`${
                        item.status === 1 ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                      } transition duration-150 ease-in-out`}
                    >
                      {item.status === 1 ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex h-[90vh] overflow-y-auto items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newCustomer.id ? 'Edit Customer' : 'Add New Customer'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={newCustomer.password}
                onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone No</label>
              <input
                type="text"
                value={newCustomer.phoneno}
                onChange={(e) => setNewCustomer({ ...newCustomer, phoneno: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={newCustomer.role}
                onChange={(e) => setNewCustomer({ ...newCustomer, role: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="flex justify-end space-x-2 mt-4">
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
                {newCustomer.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableCustomerTable;

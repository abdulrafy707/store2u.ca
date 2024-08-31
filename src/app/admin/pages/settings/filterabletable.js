'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const FilterableTable = ({ settings = [], fetchSettings }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(settings);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [settingForm, setSettingForm] = useState({
    deliveryCharge: '',
    taxPercentage: '',
    other1: 0,
    other2: 0,
  });
  const router = useRouter();

  useEffect(() => {
    setFilteredData(
      settings.filter((item) =>
        item &&
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, settings]);

  const handleEditItem = (item) => {
    setEditSetting(item);
    setSettingForm({
      deliveryCharge: item.deliveryCharge,
      taxPercentage: item.taxPercentage,
      other1: item.other1,
      other2: item.other2,
    });
    setIsModalVisible(true);
  };

  const handleAddNewItem = () => {
    setEditSetting(null);
    setSettingForm({
      deliveryCharge: '',
      taxPercentage: '',
      other1: 0,
      other2: 0,
    });
    setIsModalVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettingForm({ ...settingForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = editSetting ? 'PUT' : 'POST';
      const url = editSetting ? `/api/settings/${editSetting.id}` : '/api/settings';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingForm),
      });

      if (response.ok) {
        fetchSettings();
        setIsModalVisible(false);
        setEditSetting(null);
        setSettingForm({
          deliveryCharge: '',
          taxPercentage: '',
          other1: 0,
          other2: 0,
        });
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditSetting(null);
    setSettingForm({
      deliveryCharge: '',
      taxPercentage: '',
      other1: 0,
      other2: 0,
    });
    setIsModalVisible(false);
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
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleAddNewItem}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Charge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.deliveryCharge}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.taxPercentage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.other1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.other2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{editSetting ? 'Edit Setting' : 'Add Setting'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Delivery Charge</label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={settingForm.deliveryCharge}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tax Percentage</label>
                <input
                  type="number"
                  name="taxPercentage"
                  value={settingForm.taxPercentage}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Other1</label>
                <input
                  type="number"
                  name="other1"
                  value={settingForm.other1}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Other2</label>
                <input
                  type="number"
                  name="other2"
                  value={settingForm.other2}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editSetting ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;

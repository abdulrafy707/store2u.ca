'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AddSetting = ({ setting = {}, fetchSettings }) => {
  const [formData, setFormData] = useState({
    deliveryCharge: setting.deliveryCharge || '',
    taxPercentage: setting.taxPercentage || '',
    other1: setting.other1 || 0,
    other2: setting.other2 || 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (setting) {
      setFormData({
        deliveryCharge: setting.deliveryCharge || '',
        taxPercentage: setting.taxPercentage || '',
        other1: setting.other1 || 0,
        other2: setting.other2 || 0,
      });
    }
  }, [setting]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSettings();
        router.push('/admin/pages/settings');
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl mb-4">{setting.id ? 'Edit Setting' : 'Add Setting'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Delivery Charge</label>
            <input
              type="number"
              name="deliveryCharge"
              value={formData.deliveryCharge}
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
              value={formData.taxPercentage}
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
              value={formData.other1}
              onChange={handleFormChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Other2</label>
            <input
              type="number"
              name="other2"
              value={formData.other2}
              onChange={handleFormChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => router.push('/admin/pages/settings')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {setting.id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSetting;

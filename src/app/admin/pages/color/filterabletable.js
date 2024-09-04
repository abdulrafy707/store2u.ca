'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import ntc from 'ntcjs'; // Importing the ntcjs library

const FilterableTable = ({ colors = [], fetchColors }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editColorId, setEditColorId] = useState(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000'); // Default to black
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFilteredData(
      (Array.isArray(colors) ? colors : []).filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, colors]);

  const handleAddNewColor = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newColorName, hex: newColorHex }),
      });
  
      if (response.ok) {
        fetchColors();
        setIsModalOpen(false);
        setNewColorName('');
        setNewColorHex('#000000');
      } else {
        console.error('Failed to add color');
      }
    } catch (error) {
      console.error('Error adding color:', error);
    }
    setIsLoading(false);
  };
  
  const handleUpdateColor = async () => {
    // Generate color name using ntc.js
    const ntcResult = ntc.name(newColorHex);
    const generatedName = ntcResult[1]; // Get the closest color name from ntc.js
  
    setIsLoading(true);
    try {
      const response = await fetch('/api/colors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editColorId, name: generatedName, hex: newColorHex }), // Use generatedName for name
      });
  
      if (response.ok) {
        fetchColors(); // Refresh the colors list
        setIsModalOpen(false); // Close the modal
        setNewColorName(''); // Reset color name
        setNewColorHex('#000000'); // Reset color hex
        setEditColorId(null); // Reset edit color id
      } else {
        console.error('Failed to update color');
      }
    } catch (error) {
      console.error('Error updating color:', error);
    }
    setIsLoading(false);
  };
  const handleDeleteColor = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/colors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchColors();
      } else {
        console.error('Failed to delete color');
      }
    } catch (error) {
      console.error('Error deleting color:', error);
    }
    setIsLoading(false);
  };

  const handleModalOpen = (color) => {
    setNewColorName(color ? color.name : '');
    setNewColorHex(color ? color.hex : '#000000'); // Set the color picker to the existing color or default
    setEditColorId(color ? color.id : null);
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
          <h2 className="text-xl font-semibold text-gray-800">Colors List</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => handleModalOpen(null)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (Hex)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
  {Array.isArray(filteredData) && filteredData.length > 0 ? (
    filteredData.map((item) => (
      <tr key={item.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.name} ({item.hex || 'N/A'}) {/* Display HEX value here */}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            className="text-indigo-600 hover:text-indigo-900 mr-2"
            onClick={() => handleModalOpen(item)}
          >
            Edit
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No data available</td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{editColorId ? 'Edit Color' : 'Add New Color'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Color Name</label>
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled // Automatically generated from hex, so disable manual editing
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Hex Value</label>
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
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
                onClick={editColorId ? handleUpdateColor : handleAddNewColor}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {editColorId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;

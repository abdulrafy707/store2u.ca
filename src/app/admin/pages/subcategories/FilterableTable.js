import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterableTable = ({ subcategories = [], fetchSubcategories, categories = [] }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    id: null,
    name: '',
    categoryId: '',
    imageUrl: '',
    meta_title: '',           // Add meta title field
    meta_description: '',     // Add meta description field
    meta_keywords: '',        // Add meta keywords field
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (Array.isArray(subcategories)) {
      setFilteredData(
        subcategories.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
  }, [filter, subcategories]);

  const handleAddNewItem = async () => {
    setIsLoading(true);
    try {
      let imageUrl = newSubcategory.imageUrl;

      if (image) {
        const imageBase64 = await convertToBase64(image);
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

      const subcategoryToSubmit = {
        ...newSubcategory,
        categoryId: parseInt(newSubcategory.categoryId, 10),
        imageUrl,
      };

      console.log('Subcategory to submit:', subcategoryToSubmit);

      const response = newSubcategory.id
        ? await fetch(`/api/subcategories/${newSubcategory.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subcategoryToSubmit),
          })
        : await fetch('/api/subcategories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subcategoryToSubmit),
          });

      const result = await response.json();
      console.log('Response from server:', result);

      if (response.ok) {
        fetchSubcategories(); // Refresh the data after adding or updating
        setIsModalOpen(false);
        setNewSubcategory({
          id: null,
          name: '',
          categoryId: '',
          imageUrl: '',
          meta_title: '',          // Reset meta title
          meta_description: '',    // Reset meta description
          meta_keywords: '',       // Reset meta keywords
        });
        setImage(null);
      } else {
        console.error('Failed to add/update subcategory:', result.message);
      }
    } catch (error) {
      console.error('Error adding or updating item:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchSubcategories(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setNewSubcategory({
      ...item,
      image: null, // Reset image for edit
      imageUrl: item.imageUrl, // Existing image URL
      meta_title: item.meta_title || '',        // Set existing meta title
      meta_description: item.meta_description || '', // Set existing meta description
      meta_keywords: item.meta_keywords || '',  // Set existing meta keywords
    });
    setIsModalOpen(true);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
          <h2 className="text-xl font-semibold text-gray-800">Subcategories List</h2>
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
                setNewSubcategory({
                  id: null,
                  name: '',
                  categoryId: '',
                  imageUrl: '',
                  meta_title: '',          // Reset meta title
                  meta_description: '',    // Reset meta description
                  meta_keywords: '',       // Reset meta keywords
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.imageUrl && <img src={`https://data.tascpa.ca/uploads/${item.imageUrl}`} alt={item.name} className="w-16 h-16 object-cover" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed pt-10 inset-0 h-[99vh] overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px] rounded shadow-lg">
            <h2 className="text-xl mb-4">{newSubcategory.id ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newSubcategory.categoryId}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {newSubcategory.imageUrl && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                <img src={`https://data.tascpa.ca/uploads/${newSubcategory.imageUrl}`} alt={newSubcategory.name} className="w-32 h-32 object-cover mb-2" />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>

            {/* Meta fields for subcategories */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Meta Title</label>
              <input
                type="text"
                value={newSubcategory.meta_title}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_title: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                value={newSubcategory.meta_description}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_description: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
              <input
                type="text"
                value={newSubcategory.meta_keywords}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, meta_keywords: e.target.value })}
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
                {newSubcategory.id ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableTable;

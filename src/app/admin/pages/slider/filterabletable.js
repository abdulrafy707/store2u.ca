'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const FilterableSliderTable = ({ sliders = [], fetchSliders }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(sliders);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for showing loading indicator
  const [editSlider, setEditSlider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderForm, setSliderForm] = useState({
    imgurl: '',
    link: '',
  });
  const [existingImage, setExistingImage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      sliders.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, sliders]);

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/slider/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchSliders(); // Refresh the data after deleting
      } else {
        console.error('Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleEditItem = (item) => {
    setEditSlider(item);
    setSliderForm({
      imgurl: '',
      link: item.link,
    });
    setExistingImage(item.imgurl || '');
    setIsModalOpen(true); // Open modal for editing
  };

  const handleAddItem = () => {
    setEditSlider(null);
    setSliderForm({
      imgurl: '',
      link: '',
    });
    setExistingImage('');
    setIsModalOpen(true); // Open modal for adding
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSliderForm({ ...sliderForm, [name]: value });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setIsLoading(true); // Show loading indicator during form submission

    try {
      let uploadedImageUrl = existingImage;

      if (fileInputRef.current.files.length > 0) {
        const imageBase64 = await convertToBase64(fileInputRef.current.files[0]);
        const response = await fetch('https://data.tascpa.ca/uploadImage.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageBase64 }),
        });
        const result = await response.json();
        if (response.ok) {
          uploadedImageUrl = result.image_url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      }

      const sliderData = {
        imgurl: uploadedImageUrl,
        link: sliderForm.link,
      };

      const method = editSlider ? 'PUT' : 'POST';
      const url = editSlider ? `/api/slider/${editSlider.id}` : '/api/slider';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sliderData),
      });

      if (response.ok) {
        fetchSliders();
        setEditSlider(null);
        setSliderForm({
          imgurl: '',
          link: '',
        });
        setExistingImage('');
        setIsModalOpen(false); // Close modal after submission
      } else {
        console.error('Failed to save slider');
      }
    } catch (error) {
      console.error('Error saving slider:', error);
    }
    setIsLoading(false); // Hide loading indicator after form submission
  };

  const handleCancelEdit = () => {
    setEditSlider(null);
    setSliderForm({
      imgurl: '',
      link: '',
    });
    setExistingImage('');
    setIsModalOpen(false); // Close modal on cancel
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Processing...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Sliders List</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleAddItem}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) &&
                filteredData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.imgurl ? (
                        <img
                          src={`https://data.tascpa.ca/uploads/${item.imgurl}`}
                          alt={`Slider Image ${item.id}`}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.link}</td>
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
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 w-[700px] max-h-[90vh] overflow-auto rounded shadow-lg">
            <h2 className="text-xl mb-4">{editSlider ? 'Edit Slider' : 'Add New Slider'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Link</label>
                <input
                  type="text"
                  name="link"
                  value={sliderForm.link}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  name="imgurl"
                  ref={fileInputRef}
                  onChange={(e) => setSliderForm({ ...sliderForm, imgurl: e.target.files[0] })}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {existingImage && (
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Existing Image</h4>
                  <div className="relative">
                    <img
                      src={`https://data.tascpa.ca/uploads/${existingImage}`}
                      alt="Existing Slider"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              )}
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
                  {editSlider ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterableSliderTable;

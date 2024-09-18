'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AddProductPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id'); // Get product ID from URL params

  // State for product form
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    richDescription: '',
    price: '',
    stock: '',
    categoryId: '',
    subcategoryId: '',
    colors: [],
    sizes: [],
    image: [],
    imageUrl: '',
    discount: '',
    isTopRated: false,
  });

  // State for fetched data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // All subcategories
  const [filteredSubcategories, setFilteredSubcategories] = useState([]); // Subcategories of selected category
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // State for images
  const [images, setImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState([]); // Existing images in edit mode

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Ref for file input to reset its value after removing images
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch initial data
    fetchCategories();
    fetchColors();
    fetchSizes();

    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Fetch all subcategories (used as fallback if needed)
  const fetchAllSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories');
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  // Fetch subcategories based on selected category ID
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setFilteredSubcategories([]);
      return;
    }

    try {
      const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setFilteredSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setFilteredSubcategories([]);
    }
  };

  // Fetch colors from API
  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      if (!response.ok) {
        throw new Error('Failed to fetch colors');
      }
      const data = await response.json();
      // Map colors for react-select
      const mappedColors = data.map(color => ({
        value: color.id,
        label: `${color.name} (${color.hex})`,
        hex: color.hex,
      }));
      setColors(mappedColors);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    }
  };

  // Fetch sizes from API
  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      if (!response.ok) {
        throw new Error('Failed to fetch sizes');
      }
      const data = await response.json();
      // Map sizes for react-select
      const mappedSizes = data.map(size => ({
        value: size.id,
        label: size.name,
      }));
      setSizes(mappedSizes);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      setSizes([]);
    }
  };

  // Fetch product data for edit mode
  const fetchProductData = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data = await response.json();

      // Parse colors and sizes from JSON strings if necessary
      const parsedColors = Array.isArray(data.colors)
        ? data.colors.map(color => ({
            value: color.id,
            label: `${color.name} (${color.hex})`,
            hex: color.hex,
          }))
        : [];

      const parsedSizes = Array.isArray(data.sizes)
        ? data.sizes.map(size => ({
            value: size.id,
            label: size.name,
          }))
        : [];

      setNewProduct({
        ...data,
        colors: parsedColors,
        sizes: parsedSizes,
      });

      setExistingImages(data.images || []);

      if (data.categoryId) {
        await fetchSubcategories(data.categoryId);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      // Optionally, redirect or show error message
    }
    setIsLoading(false);
  };

  // Convert image file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle adding new product
  const handleAddNewItem = async () => {
    // Basic form validation
    if (
      !newProduct.name.trim() ||
      !newProduct.richDescription.trim() ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.subcategoryId
    ) {
      alert("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      // Upload new images and get their URLs
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const imageBase64 = await convertToBase64(img);
          const response = await fetch('https://data.tascpa.ca/uploadImage.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) {
            return result.image_url;
          } else {
            throw new Error(result.error || 'Failed to upload image');
          }
        })
      );

      // Prepare product data for submission
      const productToSubmit = {
        ...newProduct,
        description: newProduct.richDescription, // Rich text HTML content
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        subcategoryId: parseInt(newProduct.subcategoryId, 10),
        colors: JSON.stringify(newProduct.colors.map(color => color.value)), // Array of color IDs as JSON string
        sizes: JSON.stringify(newProduct.sizes.map(size => size.value)), // Array of size IDs as JSON string
        images: uploadedImages, // Array of image URLs
        discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
        isTopRated: newProduct.isTopRated,
      };

      // Make POST request to add new product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        // Redirect to products list page after successful addition
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData.message);
        alert(`Failed to create product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Error adding product: ${error.message}`);
    }

    setIsLoading(false);
  };

  // Handle updating existing product
  const updateProduct = async () => {
    // Basic form validation
    if (
      !newProduct.name.trim() ||
      !newProduct.richDescription.trim() ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.subcategoryId
    ) {
      alert("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      // Upload new images and get their URLs
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const imageBase64 = await convertToBase64(img);
          const response = await fetch('https://data.tascpa.ca/uploadImage.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageBase64 }),
          });
          const result = await response.json();
          if (response.ok) {
            return result.image_url;
          } else {
            throw new Error(result.error || 'Failed to upload image');
          }
        })
      );

      // Prepare updated product data
      const productToSubmit = {
        ...newProduct,
        description: newProduct.richDescription, // Rich text HTML content
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        subcategoryId: parseInt(newProduct.subcategoryId, 10),
        colors: JSON.stringify(newProduct.colors.map(color => color.value)), // Array of color IDs as JSON string
        sizes: JSON.stringify(newProduct.sizes.map(size => size.value)), // Array of size IDs as JSON string
        images: [...existingImages, ...uploadedImages], // Combine existing and new image URLs
        discount: newProduct.discount ? roundToTwoDecimalPlaces(parseFloat(newProduct.discount)) : null,
        isTopRated: newProduct.isTopRated,
      };

      // Make PUT request to update the product
      const response = await fetch(`/api/products/${newProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        // Redirect to products list page after successful update
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to update product:', errorData.message);
        alert(`Failed to update product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Error updating product: ${error.message}`);
    }

    setIsLoading(false);
  };

  // Utility function to round numbers to two decimal places
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  // Remove existing image in edit mode
  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Remove new image before uploading
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white shadow rounded-lg p-6 relative">
        <h2 className="text-2xl mb-6">
          {newProduct.id ? 'Edit Product' : 'Add New Product'}
        </h2>

        {/* Section 1: Product Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  setNewProduct({ ...newProduct, categoryId, subcategoryId: '' });
                  fetchSubcategories(categoryId);
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            {filteredSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={newProduct.subcategoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, subcategoryId: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs.)
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={newProduct.stock !== null ? newProduct.stock.toString() : ''}
                min="0" // Prevents the stock from being less than 0 in the input itself
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value >= 0) { // Ensure stock is not negative
                    setNewProduct({ ...newProduct, stock: value });
                  }
                }}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                value={newProduct.discount ? roundToTwoDecimalPlaces(newProduct.discount) : ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    discount: e.target.value ? parseFloat(e.target.value) : '',
                  })
                }
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount percentage"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            {/* Top Rated */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.isTopRated}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, isTopRated: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Top Rated
              </label>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colors
              </label>
              <Select
                isMulti
                value={newProduct.colors}
                onChange={(selected) =>
                  setNewProduct({ ...newProduct, colors: selected })
                }
                options={colors}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select colors"
                formatOptionLabel={({ label, hex }) => (
                  <div className="flex items-center">
                    <span
                      style={{
                        backgroundColor: hex,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    ></span>
                    <span>{label}</span>
                  </div>
                )}
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sizes
              </label>
              <Select
                isMulti
                value={newProduct.sizes}
                onChange={(selected) =>
                  setNewProduct({ ...newProduct, sizes: selected })
                }
                options={sizes}
                className="mt-1"
                classNamePrefix="select"
                placeholder="Select sizes"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rich Text Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <ReactQuill
            value={newProduct.richDescription}
            onChange={(value) =>
              setNewProduct({ ...newProduct, richDescription: value })
            }
            className="h-64"
            placeholder="Enter product description..."
          />
        </div>

        {/* Section 3: Upload Images */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Images</h3>

          {/* New Images Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              ref={fileInputRef}
              accept="image/*"
            />
          </div>

          {/* Existing Images (Edit Mode Only) */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`https://data.tascpa.ca/uploads/${img}`}
                      alt={`Product Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png'; // Fallback image
                      }}
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      title="Remove Image"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">New Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.png'; // Fallback image
                      }}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      title="Remove Image"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/admin/pages/Products')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={newProduct.id ? updateProduct : handleAddNewItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {newProduct.id ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Suspense fallback can be customized as needed
const AddProductPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <AddProductPageContent />
    </Suspense>
  );
};

export default AddProductPage;

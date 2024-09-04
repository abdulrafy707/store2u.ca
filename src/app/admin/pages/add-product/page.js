'use client';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AddProductPageContent = () => {
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
    image: null,
    imageUrl: '',
    discount: '',
    isTopRated: false,
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
      const data = await response.json();
      setFilteredSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch('/api/colors');
      const data = await response.json();
      setColors(data.map(color => ({ value: color.id, label: `${color.name} (${color.hex})`, hex: color.hex })));
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/sizes');
      const data = await response.json();
      setSizes(data.map(size => ({ value: size.id, label: size.name })));
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchProductData = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setNewProduct({
        ...data,
        colors: data.colors.map((color) => ({ value: color.id, label: `${color.name} (${color.hex})`, hex: color.hex })),
        sizes: data.sizes.map((size) => ({ value: size.id, label: size.name })),
      });
      setExistingImages(data.images || []);
      if (data.categoryId) {
        fetchSubcategories(data.categoryId);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleAddNewItem = async () => {
    if (!newProduct.name || !newProduct.richDescription || !newProduct.price || !newProduct.stock || !newProduct.subcategoryId) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);

    try {
      const uploadedImages = await Promise.all(images.map(async (img) => {
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
      }));

      const productToSubmit = {
        ...newProduct,
        description: newProduct.richDescription, // Directly save the rich text HTML content
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        subcategoryId: parseInt(newProduct.subcategoryId),
        colors: JSON.stringify(newProduct.colors), // Store as JSON string with value and label
        sizes: JSON.stringify(newProduct.sizes), // Store as JSON string with value and label
        images: uploadedImages,
        discount: newProduct.discount ? newProduct.discount : null,

        isTopRated: newProduct.isTopRated,
      };

      const response = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
    setIsLoading(false);
  };
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };
  

  const updateProduct = async () => {
    if (!newProduct.name || !newProduct.richDescription || !newProduct.price || !newProduct.stock || !newProduct.subcategoryId) {
      alert("All fields are required");
      return;
    }
    setIsLoading(true);

    try {
      const uploadedImages = await Promise.all(images.map(async (img) => {
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
      }));

      const productToSubmit = {
        ...newProduct,
        description: newProduct.richDescription, // Directly save the rich text HTML content
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        subcategoryId: parseInt(newProduct.subcategoryId),
        colors: newProduct.colors.map(color => color.value), // Convert to array of color IDs
        sizes: newProduct.sizes.map(size => size.value), // Convert to array of size IDs
        images: [...existingImages, ...uploadedImages],
        discount: newProduct.discount ? newProduct.discount : null,

        isTopRated: newProduct.isTopRated,
      };

      const response = await fetch(`/api/products/${newProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSubmit),
      });

      if (response.ok) {
        router.push('/admin/pages/Products');
      } else {
        const errorData = await response.json();
        console.error('Failed to update product:', errorData.message);
      }
    } catch (error) {
      console.error('Error updating item:', error);
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
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <h2 className="text-xl mb-4">{newProduct.id ? 'Edit Product' : 'Add New Product'}</h2>

        {/* Section 1: Product Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category</label>
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
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {filteredSubcategories.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={newProduct.subcategoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, subcategoryId: e.target.value })}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Discount</label>
              <input
  type="number"
  value={newProduct.discount ? roundToTwoDecimalPlaces(newProduct.discount) : ''}
  onChange={(e) => setNewProduct({ ...newProduct, discount: parseFloat(e.target.value) || 0 })}
  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
            </div>
            <div className="mb-4 grid grid-cols-2 ">
              <div>
                <label className="block text-sm font-medium text-gray-700">Top Rated</label>
              </div>
              <div className='flex justify-start items-start'>
                <input
                  type="checkbox"
                  checked={newProduct.isTopRated}
                  onChange={(e) => setNewProduct({ ...newProduct, isTopRated: e.target.checked })}
                  className="mt-1 p-2 border h-5 border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Colors</label>
              <Select
                isMulti
                value={newProduct.colors}
                onChange={(selected) => setNewProduct({ ...newProduct, colors: selected })}
                options={colors}
                className="mt-1"
                classNamePrefix="select"
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Sizes</label>
              <Select
                isMulti
                value={newProduct.sizes}
                onChange={(selected) => setNewProduct({ ...newProduct, sizes: selected })}
                options={sizes}
                className="mt-1"
                classNamePrefix="select"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rich Text Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <ReactQuill
            value={newProduct.richDescription}
            onChange={(value) => setNewProduct({ ...newProduct, richDescription: value })}
            className="h-64"
          />
        </div>

        {/* Section 3: Upload Images */}
        <div className="mb-6 pt-8">
          <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              ref={fileInputRef}
            />
          </div>
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Existing Images</h4>
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`https://data.tascpa.ca/uploads/${img}`}
                      alt={`Product Image ${index}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">New Images</h4>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Product Image ${index}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
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

const AddProductPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProductPageContent />
    </Suspense>
  );
};

export default AddProductPage;

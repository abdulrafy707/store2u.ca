'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const FilterableTable = ({
  products = [],
  fetchProducts,
  categories = [],
  subcategories = [],
  colors = [],
  sizes = [],
}) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(products);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    subcategoryId: '',
    colors: [],
    sizes: [],
    discount: '',
    isTopRated: false,
    images: [],
    meta_title: '',           // Add meta title field
    meta_description: '',     // Add meta description field
    meta_keywords: '',        // Add meta keywords field
  });
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setFilteredData(
      products.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, products]);

  useEffect(() => {
    if (subcategories.length) {
      setFilteredSubcategories(
        subcategories.filter(
          (subcat) => subcat.categoryId === parseInt(selectedCategory)
        )
      );
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleDeleteClick = (id) => {
    setItemIdToDelete(id);
    setIsPopupVisible(true);
  };

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${itemIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchProducts(); // Refresh the data after deleting
        setIsPopupVisible(false);
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setIsLoading(false);
  };

  const handleCancelDelete = () => {
    setIsPopupVisible(false);
    setItemIdToDelete(null);
  };

  const handleEditItem = (item) => {
    setEditProduct(item);
  
    // Get the existing colors and sizes for this product
    const existingColors = colors
      .filter((color) => item.colors.includes(color.id))
      .map((color) => ({
        value: color.id,
        label: `${color.name} (${color.hex})`,
        hex: color.hex,
      }));
  
    const existingSizes = sizes
      .filter((size) => item.sizes.includes(size.id))
      .map((size) => ({ value: size.id, label: size.name }));
  
    // Set the product form with the existing product values including the meta fields
    setProductForm({
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      subcategoryId: item.subcategoryId,
      colors: existingColors, // Set existing colors
      sizes: existingSizes,    // Set existing sizes
      discount: item.discount || '',
      isTopRated: item.isTopRated || false,
      images: [], // Reset the image input for uploading new images
      meta_title: item.meta_title || '',           // Set existing meta title
      meta_description: item.meta_description || '', // Set existing meta description
      meta_keywords: item.meta_keywords || '',     // Set existing meta keywords
    });
  
    setExistingImages(item.images || []); // Set existing images for the product
  };
  

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (name === 'stock') {
      const parsedValue = parseInt(value, 10);
      newValue = isNaN(parsedValue) ? '' : Math.max(0, parsedValue);
    } else {
      newValue = value;
    }

    setProductForm({
      ...productForm,
      [name]: newValue,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const roundToTwoDecimalPlaces = (num) => {
    return Math.round(num * 100) / 100;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedImages = await Promise.all(
        [...fileInputRef.current.files].map(async (file) => {
          const imageBase64 = await convertToBase64(file);
          const response = await fetch(
            'https://data.tascpa.ca/uploadImage.php',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image: imageBase64 }),
            }
          );
          const result = await response.json();
          if (response.ok) {
            return result.image_url;
          } else {
            throw new Error(result.error || 'Failed to upload image');
          }
        })
      );

      const stockValue = parseInt(productForm.stock, 10);

      const productData = {
        ...productForm,
        stock: isNaN(stockValue) ? 0 : stockValue,
        images: [
          ...existingImages.map((img) => img.url),
          ...uploadedImages,
        ],
        discount: productForm.discount ? productForm.discount : null,
        isTopRated: productForm.isTopRated,
        colors: productForm.colors.map((color) => color.value),
        sizes: productForm.sizes.map((size) => size.value),
        meta_title: productForm.meta_title,
        meta_description: productForm.meta_description,
        meta_keywords: productForm.meta_keywords,
      };

      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        fetchProducts();
        setEditProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          subcategoryId: '',
          colors: [],
          sizes: [],
          discount: '',
          isTopRated: false,
          images: [],
          meta_title: item.meta_title || '',           // Set existing meta title
          meta_description: item.meta_description || '', // Set existing meta description
          meta_keywords: item.meta_keywords || '',     // Set existing meta keywords
        });
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      subcategoryId: '',
      colors: [],
      sizes: [],
      discount: '',
      isTopRated: false,
      images: [],
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductForm({
      ...productForm,
      images: [...productForm.images, ...files],
    });
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };

  const handleRemoveImage = (index) => {
    setProductForm((prevForm) => ({
      ...prevForm,
      images: prevForm.images.filter((_, i) => i !== index),
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              If you delete this product, all orders related to this product
              will also be deleted. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Products List
          </h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => router.push('/admin/pages/add-product')}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(filteredData) &&
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={`https://data.tascpa.ca/uploads/${item.images[0].url}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    ></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
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

      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh] overflow-auto rounded shadow-lg">

            <h2 className="text-xl mb-4">Edit Product</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <ReactQuill
                  value={productForm.description}
                  onChange={(value) =>
                    setProductForm({ ...productForm, description: value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={
                    productForm.stock !== null
                      ? productForm.stock.toString()
                      : ''
                  }
                  min="0"
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={
                    productForm.discount
                      ? productForm.discount.toFixed(2)
                      : ''
                  }
                  step="0.01"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      discount: roundToTwoDecimalPlaces(
                        parseFloat(e.target.value) || 0
                      ),
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Top Rated
                </label>
                <input
                  type="checkbox"
                  name="isTopRated"
                  checked={productForm.isTopRated}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={productForm.subcategoryId}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {filteredSubcategories.map((subcat) => (
                    <option key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Colors
                </label>
                <Select
                  isMulti
                  name="colors"
                  value={productForm.colors}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, colors: selected })
                  }
                  options={colors.map((color) => ({
                    value: color.id,
                    label: `${color.name} (${color.hex})`,
                    hex: color.hex,
                  }))}
                  getOptionLabel={(color) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          backgroundColor: color.hex,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          display: 'inline-block',
                          marginRight: '10px',
                        }}
                      ></span>
                      {color.label}
                    </div>
                  )}
                />
              </div>
              {productForm.colors.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">
                    Selected Colors
                  </h4>
                  <div className="flex space-x-2">
                    {productForm.colors.map((color, index) => (
                      <div key={index} className="relative">
                        <span
                          style={{
                            backgroundColor: color.hex,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '10px',
                          }}
                        ></span>
                        <span>{color.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sizes
                </label>
                <Select
                  isMulti
                  name="sizes"
                  value={productForm.sizes}
                  onChange={(selected) =>
                    setProductForm({ ...productForm, sizes: selected })
                  }
                  options={sizes.map((size) => ({
                    value: size.id,
                    label: size.name,
                  }))}
                />
              </div>


              <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Meta Title
  </label>
  <input
    type="text"
    name="meta_title"
    value={productForm.meta_title}
    onChange={handleFormChange}
    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Meta Description
  </label>
  <textarea
    name="meta_description"
    value={productForm.meta_description}
    onChange={handleFormChange}
    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Meta Keywords
  </label>
  <input
    type="text"
    name="meta_keywords"
    value={productForm.meta_keywords}
    onChange={handleFormChange}
    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>






              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <input
                  type="file"
                  name="images"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  multiple
                />
              </div>
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">
                  Existing Images
                </h4>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`https://data.tascpa.ca/uploads/${img.url}`}
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
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productForm.images.map((img, index) => (
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
                  Update
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

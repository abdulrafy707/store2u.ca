'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '@/app/store/cartSlice';
import { ThreeDots } from 'react-loader-spinner';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCartState] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // For optional loading indicator

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const { product, relatedProducts } = response.data.data;

        const parsedSizes = JSON.parse(product.sizes || '[]');
        const parsedColors = JSON.parse(product.colors || '[]');

        setSizes(Array.isArray(parsedSizes) ? parsedSizes : []);
        setColors(Array.isArray(parsedColors) ? parsedColors : []);

        setProduct(product);
        setRelatedProducts(relatedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartState(storedCart);
    dispatch(setCart(storedCart));
  }, [dispatch]);

  const handleAddToCart = (product) => {
    // Check if quantity exceeds stock
    if (quantity > product.stock) {
      toast.error(`You cannot add more than ${product.stock} of this item.`);
      return;
    }

    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select a size and color.');
      return;
    }

    const newCartItem = {
      id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      productId: product.id,
      quantity,
      price: product.discount
        ? calculateOriginalPrice(product.price, product.discount)
        : product.price,
      selectedColor,
      selectedSize,
      images: product.images,
      name: product.name,
      discount: product.discount,
    };

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    let updatedCart = [...cart];

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedCart.push(newCartItem);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
    setIsModalOpen(true); // Show related products modal
  };

  const calculateOriginalPrice = (price, discount) => {
    if (typeof price === 'number' && typeof discount === 'number') {
      return price - (price * (discount / 100));
    }
    return price;
  };

  const getImageUrl = (url) => {
    return `https://data.tascpa.ca/uploads/${url}`;
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/'); // Navigate to home page when the modal is closed
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#3498db"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      <div className="flex flex-wrap pt-4 items-stretch min-h-screen">
        {/* Product Images and Details */}
        <div className="w-full lg:w-3/5 mt-8 mb-8 lg:mb-0 flex flex-col h-full">
          <div className="flex w-20 flex-col justify-center items-center mr-4">
            {product.images && product.images.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image.url)}
                alt={product.name}
                className={`w-20 h-20 object-cover mb-2 cursor-pointer ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => handleThumbnailClick(index)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png'; // Fallback image
                }}
              />
            ))}
          </div>
          <div className="relative w-full pt-8 pl-4 right-0">
            {product.images && product.images.length > 0 ? (
              <motion.img
                key={currentImageIndex}
                src={getImageUrl(product.images[currentImageIndex].url)}
                alt={product.name}
                className="w-full h-[400px] object-contain mb-4 cursor-pointer"
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.png'; // Fallback image
                }}
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Info and Add to Cart */}
        <div className="w-full lg:w-2/5 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{product.name.toUpperCase()}</h2>
          
          <div className="flex items-center mb-4">
            {product.discount ? (
              <>
                <span className="text-green-500 text-xl line-through mr-4">
                  Rs.{formatPrice(product.price)}
                </span>
                <span className="text-red-500 font-bold text-xl">
                  Rs.{formatPrice(calculateOriginalPrice(product.price, product.discount))}
                </span>
              </>
            ) : (
              <span className="text-red-500 text-2xl">
                Rs.{formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {product.stock === 0 && <p className="text-lg font-bold text-red-700 mb-1">Out of Stock</p>}
          {product.stock > 0 && <p className="text-lg font-bold text-green-700 mb-1">In Stock</p>}

          {/* Color and Size Selection */}
          {colors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Select Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.label)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                      selectedColor === color.label ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    <span className="sr-only">{color.label}</span>
                  </button>
                ))}
              </div>
              {selectedColor && <p className="text-sm mt-2">Selected Color: <strong>{selectedColor}</strong></p>}
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Select Size</h3>
              <div className="flex space-x-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size.label)}
                    disabled={size.stock === 0}
                    className={`w-10 h-10 border text-center flex items-center justify-center cursor-pointer
                      ${selectedSize === size.label ? 'border-black border-[2px]' : 'border-gray-300'} 
                      ${size.stock === 0 ? 'line-through cursor-not-allowed text-gray-400' : 'hover:border-black'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center mb-4 border border-gray-300 rounded-full px-4 py-1 w-32">
            <button
              className="text-gray-700 px-2"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              className="text-gray-700 px-2"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <FiPlus />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            className="bg-teal-500 text-white py-2 px-4 rounded-md w-full"
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
          >
            Add to cart
          </button>
          {/* <h3 className='text-md font-semibold text-gray-700 mb-4 mt-4'>product.meta_title</h3> */}

          <h3 className='text-md font-semibold text-gray-700 mb-4 mt-4'>Description</h3>
          <div className="text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
        <div className="rounded grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 px-1 sm:px-4 lg:px-0">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => {
              const originalPrice = calculateOriginalPrice(relatedProduct.price, relatedProduct.discount);
              return (
                <div
                  key={relatedProduct.id}
                  className="bg-white shadow-md rounded-sm cursor-pointer border border-gray-300 relative min-h-[320px] w-full"
                  onClick={() => router.push(`/customer/pages/product/${relatedProduct.id}`)}
                >
                  {relatedProduct.discount && (
                    <div className="absolute z-40 top-0 left-0 bg-red-100 text-red-600 font-normal text-sm px-1 py-0.5">
                      {relatedProduct.discount.toFixed(2)}% OFF
                    </div>
                  )}
                  <div className="relative">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <motion.img
                        src={getImageUrl(relatedProduct.images[0].url)}
                        alt={relatedProduct.name}
                        className="h-[240px] w-full object-cover mb-4 rounded bg-white"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.png'; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="h-[240px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 right-2 bg-teal-500 text-white h-8 w-8 flex justify-center items-center rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        router.push(`/customer/pages/product/${relatedProduct.id}`);
                      }}
                    >
                      <span className="text-xl font-bold leading-none">+</span>
                    </button>
                  </div>
                 
                  <div className="grid grid-cols-2 px-2">
                    <div className="flex items-center">
                      {relatedProduct.discount ? (
                        <div className="flex items-center justify-center gap-3 flex-row-reverse">
                          <p className="text-md font-normal text-gray-700 line-through">
                            Rs.{formatPrice(relatedProduct.price)}
                          </p>
                          <p className="text-md font-bold text-red-700">
                            Rs.{formatPrice(originalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-gray-700">
                          Rs.{formatPrice(relatedProduct.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <h3
                    className="text-sm font-normal text-gray-800 overflow-hidden hover:underline hover:text-blue-400 cursor-pointer"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2, // Limits to 2 lines
                      maxHeight: '3em', // Approximate height for 2 lines
                    }}
                    onClick={() => router.push(`/customer/pages/product/${relatedProduct.id}`)}
                  >
                    {relatedProduct.name.toUpperCase()}
                  </h3>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full py-8 text-gray-500">
              No related products available.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Related Products */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Related Products"
        style={{
          overlay: {
            zIndex: 10000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            zIndex: 10001,
            margin: 'auto',
            width: 'fit-content',
            height: 'fit-content',
            padding: '20px',
            textAlign: 'center',
          },
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-semibold mb-4">
              Products You May Be Interested In
            </h2>
            <button
              className="text-gray-500"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="flex flex-col items-center w-32 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => {
                  router.push(`/customer/pages/products/${relatedProduct.id}`);
                  setIsModalOpen(false); // Close the modal after navigation
                }}
              >
                <img
                  src={getImageUrl(relatedProduct.images[0]?.url || '')}
                  alt={relatedProduct.name}
                  className="w-32 h-32 object-cover mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
                <p className="text-sm text-gray-800 truncate w-full" title={relatedProduct.name}>
                  {relatedProduct.name}
                </p>
                <p className="text-sm text-red-500">Rs.{formatPrice(relatedProduct.price)}</p>
              </div>
            ))}
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPage;

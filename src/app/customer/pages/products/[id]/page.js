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
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push(newCartItem);
    }

    setCartState(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatch(setCart(updatedCart));

    toast.success('Item added to cart successfully!');
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
      <div className="flex flex-wrap pt-4">
        <div className="w-full lg:w-1/2 justify-between items-center mb-8 lg:mb-0 flex">
          <div className="flex w-20 flex-col justify-center items-center mr-4">
            {product.images && product.images.map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image.url)}
                alt={product.name}
                className={`w-20 h-20 object-cover mb-2 cursor-pointer ${index === currentImageIndex ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
          <div className="relative w-full pl-4 right-0">
            {product.images && product.images.length > 0 ? (
              <>
                <motion.img
                  key={currentImageIndex}
                  src={getImageUrl(product.images[currentImageIndex].url)}
                  alt={product.name}
                  className="w-full h-[400px] object-contain mb-4 cursor-pointer"
                  transition={{ duration: 0.3 }}
                />
              </>
            ) : (
              <div className="h-48 w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <div className="flex items-center mb-4">
            {product.discount ? (
              <>
                <span className="text-green-500 text-xl line-through mr-4">Rs.{product.price}</span>
                <span className="text-red-500 font-bold text-xl">Rs.{calculateOriginalPrice(product.price, product.discount)}</span>
              </>
            ) : (
              <span className="text-red-500 text-2xl">Rs.{product.price}</span>
            )}
          </div>

          {product.stock === 0 && (
            <p className="text-lg font-bold text-red-700 mb-1">Out of Stock</p>
          )}
          {product.stock > 0 && (
            <p className="text-lg font-bold text-green-700 mb-1">In Stock</p>
          )}
          
          <div className="text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: product.description }}></div>

          {/* Color Swatches */}
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
                    style={{ backgroundColor: color.hex }} // Assuming `color.hex` contains the hex color value
                  >
                    <span className="sr-only">{color.label}</span>
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm mt-2">
                  Selected Color: <strong>{selectedColor}</strong>
                </p>
              )}
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
          disabled={size.stock === 0} // Disable button if the size is out of stock
          className={`w-10 h-10 border text-center flex items-center justify-center cursor-pointer
            ${selectedSize === size.label ? 'border-black border-[4px]' : 'border-gray-300'} 
            ${size.stock === 0 ? 'line-through cursor-not-allowed text-gray-400' : 'hover:border-black'}`}
        >
          {size.label}
        </button>
      ))}
    </div>
  </div>
)}


          <div className="flex items-center mb-4">
            <button
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
            >
              -
            </button>
            <input
              type="text"
              readOnly
              value={quantity} 
              className="w-12 text-center text-black border-gray-300 border-y"
            />
            <button
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r"
              onClick={() => setQuantity(prev => prev + 1)} 
            >
              +
            </button>
          </div>

          <button className="bg-teal-500 text-white py-2 px-4 rounded-md" onClick={() => handleAddToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((relatedProduct) => {
              const originalPrice = calculateOriginalPrice(relatedProduct.price, relatedProduct.discount);
              return (
                <div
                  key={relatedProduct.id}
                  className="bg-white shadow-md cursor-pointer border border-gray-300 relative h-[320px] md:h-[300px] w-[220px] md:w-[200px] flex-shrink-0"
                  onClick={() => router.push(`/customer/pages/products/${relatedProduct.id}`)}
                >
                  {relatedProduct.discount && (
                    <div className="absolute z-40 top-2 right-2 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center">
                      -{relatedProduct.discount}%
                    </div>
                  )}
                  <div className="relative">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <motion.img
                        src={getImageUrl(relatedProduct.images[0].url)}
                        alt={relatedProduct.name}
                        className="h-[240px] md:h-[220px] w-full object-cover mb-4 rounded bg-white"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="h-[240px] md:h-[220px] w-full bg-gray-200 mb-4 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="pt-2 px-2 text-sm font-normal text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{relatedProduct.name}</h3>
                  <div className="grid grid-cols-2 py-2">
                    <div className="flex items-center">
                      {relatedProduct.discount ? (
                        <div className="flex items-center justify-center gap-3 flex-row-reverse">
                          <p className="text-xs font-normal text-gray-700 line-through ">
                            Rs.{relatedProduct.price}
                          </p>
                          <p className="text-sm font-semibold text-red-700">
                            Rs.{originalPrice}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-normal text-gray-700">
                          Rs.{relatedProduct.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full py-8 text-gray-500">No related products available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

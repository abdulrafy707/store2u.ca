'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { MdExpandMore } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '@/app/store/cartSlice';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown element
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setAuthToken(token);
      setUserRole(decodedToken.role);
    }

    fetchCategories();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/'); // Redirect to the home page if the search query is empty
    } else {
      const searchPageUrl = `/customer/pages/allproducts?search=${encodeURIComponent(searchQuery.trim())}`;
      router.push(searchPageUrl);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    setIsSignOutModalOpen(true); // Open the sign-out confirmation modal
  };

  const confirmSignOut = () => {
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
    setUserRole(null);
    router.push('/customer/pages/login');
  };

  const cancelSignOut = () => {
    setIsSignOutModalOpen(false);
  };

  const visibleCategories = categories.slice(0, 5);
  const hiddenCategories = categories.slice(5);

  return (
    <header className="bg-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/">
            <img src="/store2ulogo.png" alt="Logo" className="h-10 w-auto cursor-pointer" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden">
          <button
            className="text-gray-700 hover:text-blue-500 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex lg:items-center lg:justify-between lg:space-x-8">
          <div className="flex flex-col lg:flex-row text-xs lg:text-[14px] text-center lg:space-x-6">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/customer/pages/category/${category.id}`}
                className="relative group text-gray-700 transition-colors duration-300 py-2 lg:py-0"
              >
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {hiddenCategories.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300 py-2 lg:py-0"
                >
                  More <MdExpandMore />
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10">
                    <div className="py-2">
                      {hiddenCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/customer/pages/category/${category.id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center space-x-4 lg:space-x-6 mt-4 lg:mt-0">
          <form className="relative flex" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Items"
              className="border rounded-full py-1 px-3 text-[14px] w-48 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-2 top-2 text-gray-700 hover:text-blue-500">
              <FaSearch />
            </button>
          </form>
          <div className="relative flex">
            <Link href="/customer/pages/cart">
              <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
              {cartItems.length > 0 && (
                <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">{cartItems.length}</span>
              )}
            </Link>
          </div>
          {authToken ? (
            <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
              <Link href="/customer/pages/orders" className="text-gray-700 text-[14px] hover:text-blue-500 transition-colors duration-300">My Orders</Link>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-blue-500 text-[14px] transition-colors duration-300 flex items-center"
              >
                <FiLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center">
              <Link href="/customer/pages/login" className="text-gray-700 text-sm mr-2 hover:text-blue-500 transition-colors duration-300">Sign in</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[60px] z-40 bg-white shadow-lg">
          <div className="flex flex-col items-center p-4 space-y-6">
            <form className="relative w-full" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full border rounded-full py-2 pl-4 pr-10 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-3 top-2 text-gray-700 hover:text-blue-500">
                <FaSearch />
              </button>
            </form>

            {/* Categories in Mobile Menu */}
            <div className="w-full px-4">
              {visibleCategories.map((category) => (
                <a
                  key={category.id}
                  href={`/customer/pages/category/${category.id}`}
                  className="block py-2 text-gray-700 hover:text-blue-500 text-center"
                >
                  {category.name}
                </a>
              ))}
              {hiddenCategories.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex justify-center items-center py-2 text-gray-700 hover:text-blue-500 transition-colors duration-300"
                  >
                    More <MdExpandMore />
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-2">
                      {hiddenCategories.map((category) => (
                        <a
                          key={category.id}
                          href={`/customer/pages/category/${category.id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center"
                        >
                          {category.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <a href="/customer/pages/cart" className="flex items-center space-x-2">
              <FiShoppingCart className="text-gray-700 hover:text-blue-500 transition-colors duration-300" />
              {cartItems.length > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {cartItems.length}
                </span>
              )}
              <span className="text-gray-700">Cart</span>
            </a>

            {authToken ? (
              <>
                <a href="/customer/pages/orders" className="text-gray-700 hover:text-blue-500 transition-colors duration-300">My Orders</a>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-blue-500 transition-colors duration-300 flex items-center space-x-2"
                >
                  <FiLogOut />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <a href="/customer/pages/login" className="text-gray-700 hover:text-blue-500 transition-colors duration-300">Sign in</a>
            )}
          </div>
        </div>
      )}

      {/* Sign-out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to sign out?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelSignOut}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

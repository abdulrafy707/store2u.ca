'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { MdExpandMore } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '@/app/store/cartSlice';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // Subcategories of the hovered category
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false); // For the department button dropdown
  const [hoveredCategory, setHoveredCategory] = useState(null); // Track the hovered category
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false); // For sign-out confirmation modal
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  // Refs for dropdowns
  const megaDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoryResponse = await fetch('/api/categories');
        const categoriesData = await categoryResponse.json();
        setCategories(categoriesData);

        const subcategoryResponse = await fetch('/api/subcategories');
        const subcategoriesData = await subcategoryResponse.json();
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
        setCategories([]);
        setSubcategories([]);
      }
    };

    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }

    fetchCategoriesAndSubcategories();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));

    // Event listener for clicks outside the mega dropdown
    const handleClickOutsideMega = (event) => {
      if (
        megaDropdownRef.current &&
        !megaDropdownRef.current.contains(event.target) &&
        !event.target.closest('#department-button') // Ensure the department button is not clicked
      ) {
        setIsMegaDropdownOpen(false);
      }
    };

    // Event listener for clicks outside the profile dropdown
    const handleClickOutsideProfile = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutsideMega);
    document.addEventListener('mousedown', handleClickOutsideProfile);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMega);
      document.removeEventListener('mousedown', handleClickOutsideProfile);
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getRandomColor = () => {
    const colors = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#6366F1']; // Add more colors if needed
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getUserInitial = () => {
    // Replace with logic to get the user's name, e.g., from JWT or session storage
    const user = sessionStorage.getItem('user') || '';
    return user.charAt(0).toUpperCase(); // Return first letter capitalized
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/'); // Redirect to the home page if the search query is empty
    } else {
      const searchPageUrl = `/customer/pages/allproducts?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      router.push(searchPageUrl);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMegaDropdown = () => {
    setIsMegaDropdownOpen(!isMegaDropdownOpen);
  };

  const handleSignOut = () => {
    setIsSignOutModalOpen(true); // Open the confirmation modal
  };

  const confirmSignOut = () => {
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
    setIsSignOutModalOpen(false); // Close the modal
    router.push('/customer/pages/login'); // Redirect to the login page
  };

  const cancelSignOut = () => {
    setIsSignOutModalOpen(false); // Close the modal without logging out
  };

  const fetchSubcategoriesForCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/subcategories/${categoryId}`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
    fetchSubcategoriesForCategory(category.id); // Fetch subcategories when a category is hovered
    setIsMegaDropdownOpen(true); // Open the mega dropdown
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/customer/pages/category/${categoryId}`);
    setIsMegaDropdownOpen(false); // Close the mega dropdown after navigation
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
    // Optionally close the mega dropdown when the mouse leaves
    // setIsMegaDropdownOpen(false);
  };

  return (
    <header className="bg-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/">
            <img
              src="/store2ulogo.png"
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
            />
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
          <div className="flex flex-col text-black lg:flex-row text-xs lg:text-[16px] text-center lg:space-x-6">
            {/* Department Button */}
            <div className="relative">
              <button
                id="department-button" // Assign an ID to reference in event listeners
                onClick={toggleMegaDropdown}
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 py-2 lg:py-0 flex items-center"
              >
                Departments <MdExpandMore />
              </button>
              {isMegaDropdownOpen && (
                <div
                  ref={megaDropdownRef}
                  className="absolute left-0 top-full mt-2 w-[500px] bg-white shadow-lg z-50 grid grid-cols-2"
                  onMouseLeave={handleCategoryLeave} // Optional: Close dropdown when mouse leaves
                >
                  {/* First Column: Categories */}
                  <div className="p-4 bg-white">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="text-gray-700 hover:text-blue-500 py-2 cursor-pointer flex items-center space-x-2"
                        onMouseEnter={() => handleCategoryHover(category)} // Trigger on hover
                        onClick={() => handleCategoryClick(category.id)} // Go to category page on click
                      >
                        {/* Image of the category */}
                        {category.imageUrl && (
                          <img
                            src={`https://data.tascpa.ca/uploads/${category.imageUrl}`} // Correct API URL or file path
                            alt={category.name}
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        )}
                        {/* Category Name */}
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Second Column: Subcategories */}
                  <div className="p-4 border-l h-[400px] bg-white overflow-y-auto">
                    {hoveredCategory ? (
                      // If a category is hovered, filter subcategories for that category
                      subcategories
                        .filter(
                          (subcategory) =>
                            subcategory.categoryId === hoveredCategory.id
                        )
                        .map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="text-gray-700 hover:text-blue-500 py-2 block flex items-center space-x-2 cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/customer/pages/subcategories/${subcategory.id}`
                              )
                            }
                          >
                            {/* Subcategory Image */}
                            {subcategory.imageUrl && (
                              <img
                                src={`https://data.tascpa.ca/uploads/${subcategory.imageUrl}`}
                                alt={subcategory.name}
                                className="w-8 h-8 object-cover rounded-full"
                              />
                            )}
                            {/* Subcategory Name */}
                            <span>{subcategory.name}</span>
                          </div>
                        ))
                    ) : (
                      // If no category is hovered, show all subcategories by default
                      subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="text-gray-700 hover:text-blue-500 py-2 block flex items-center space-x-2 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/customer/pages/subcategories/${subcategory.id}`
                            )
                          }
                        >
                          {/* Subcategory Image */}
                          {subcategory.imageUrl && (
                            <img
                              src={`https://data.tascpa.ca/uploads/${subcategory.imageUrl}`}
                              alt={subcategory.name}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                          )}
                          {/* Subcategory Name */}
                          <span>{subcategory.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Show First 5 Categories */}
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/customer/pages/category/${category.id}`}
                className="relative group text-gray-700 transition-colors duration-300 py-2 lg:py-0"
              >
                {category.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Search, Cart, and Profile */}
        <div className="hidden lg:flex items-center space-x-4 lg:space-x-6 mt-4 lg:mt-0">
          {/* Search Form */}
          <form className="relative flex" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Items"
              className="border rounded-full py-1 px-3 text-[14px] w-48 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 text-gray-700 hover:text-blue-500"
            >
              <FaSearch />
            </button>
          </form>

          {/* Shopping Cart */}
          <div className="relative flex">
            <Link href="/customer/pages/cart">
              <FiShoppingCart className="text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
              {cartItems.length > 0 && (
                <span className="absolute top-[-12px] right-[-12px] bg-red-500 text-white rounded-full px-1 text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Profile Icon */}
          {authToken ? (
            <div className="relative">
              {/* Profile Button */}
              <div ref={profileButtonRef}>
                <FiUser
                  className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle the dropdown on click
                />
              </div>

              {/* Dropdown for profile options */}
              {isDropdownOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg p-2 z-50"
                >
                  <Link
                    href="/customer/pages/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/customer/pages/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center">
              <Link
                href="/customer/pages/login"
                className="text-gray-700 text-sm mr-2 hover:text-blue-500 transition-colors duration-300"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 w-full bg-white shadow-lg z-50">
          {/* Search bar at the top */}
          <div className="p-4 border-b">
            <form className="relative flex" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Items"
                className="border rounded-full py-1 px-3 text-[14px] w-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-700 hover:text-blue-500"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Categories and More Button */}
          <nav className="flex flex-col space-y-2 items-center p-4">
            {categories.slice(0, 5).map((category) => (
              <div
                key={category.id}
                className="text-gray-700 hover:text-blue-500 py-2 cursor-pointer"
                onClick={() => handleCategoryClick(category.id)} // Navigate to category page
              >
                {category.name}
              </div>
            ))}
            {categories.length > 5 && (
              <button
                className="text-blue-500 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)} // Close the mobile menu
              >
                Show More
              </button>
            )}

            {/* If the user is logged in, show "My Orders" */}
            {authToken && (
              <div
                className="text-gray-700 hover:text-blue-500 py-2 cursor-pointer"
                onClick={() => router.push('/customer/pages/orders')}
              >
                My Orders
              </div>
            )}

            {/* Log Out Button if user is logged in */}
            {authToken ? (
              <div
                className="text-gray-700 hover:text-blue-500 py-2 cursor-pointer"
                onClick={handleSignOut}
              >
                Log Out
              </div>
            ) : (
              <Link
                href="/customer/pages/login"
                className="text-gray-700 hover:text-blue-500 py-2"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Sign-out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Sign Out</h2>
            <p>Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={cancelSignOut}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmSignOut}
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

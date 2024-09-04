'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
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
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }

    fetchCategories();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    dispatch(setCart(storedCart));
  }, [dispatch]);

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

  const toggleMegaDropdown = () => {
    setIsMegaDropdownOpen(!isMegaDropdownOpen);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
    router.push('/customer/pages/login');
  };

  const fetchSubcategories = async (categoryId) => {
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
    fetchSubcategories(category.id); // Fetch subcategories when a category is hovered
    setIsMegaDropdownOpen(true); // Open the mega dropdown
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/customer/pages/category/${categoryId}`);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null); // Reset on mouse leave
    setSubcategories([]); // Clear subcategories
  };

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
          <div className="flex flex-col text-black lg:flex-row text-xs lg:text-[16px] text-center lg:space-x-6">
            {/* Department Button */}
            <div className="relative">
              <button
                onClick={toggleMegaDropdown}
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300 py-2 lg:py-0 flex items-center"
              >
                Departments <MdExpandMore />
              </button>
              {isMegaDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-7 w-[400px] bg-white shadow-lg z-50 grid grid-cols-2"
                  onMouseLeave={handleCategoryLeave} // Close dropdown when mouse leaves
                >
                  {/* First Column: Categories */}
                  {/* First Column: Categories */}
{/* First Column: Categories */}
<div className="p-4 bg-[#EBF5FA]">
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
                  {/* Second Column: Subcategories */}
<div className="p-4 border-l bg-[#BDEDEA]">
  {hoveredCategory ? (
    subcategories.length > 0 ? (
      subcategories.map((subcategory) => (
        <div
          key={subcategory.id}
          className="text-gray-700 hover:text-blue-500 py-2 block flex items-center space-x-2 cursor-pointer"
        >
          {/* Subcategory Image */}
          {subcategory.imageUrl && (
            <img
              src={`https://data.tascpa.ca/uploads/${subcategory.imageUrl}`} // Ensure to adjust this to your actual API or file path
              alt={subcategory.name}
              className="w-8 h-8 object-cover rounded-full"
            />
          )}
          {/* Subcategory Name */}
          <Link href={`/customer/pages/subcategory/${subcategory.id}`}>
            <span>{subcategory.name}</span>
          </Link>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No subcategories</p>
    )
  ) : (
    <p className="text-gray-500">Hover over a category</p>
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
                <span className="absolute top-[-12px] right-[-12px] bg-red-500 text-white rounded-full px-1 text-[10px] font-bold">{cartItems.length}</span>
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
    </header>
  );
};

export default Header;

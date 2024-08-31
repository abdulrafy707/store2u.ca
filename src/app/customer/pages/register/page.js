'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added confirmPassword field
    phoneno: '',
    city: '',
    role: 'CUSTOMER', // or 'ADMIN'
    image: null,
    base64: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'name') {
      // Allow only letters (A-Z, a-z)
      const lettersOnly = /^[A-Za-z\s]*$/;
      if (!lettersOnly.test(value)) {
        toast.error('Name should only contain letters.');
        return;
      }
    }
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
        base64: reader.result.split(',')[1], // Get base64 part of the string
      }));
    };

    reader.readAsDataURL(file);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Add +92 prefix if it's not there and format the number
    if (!value.startsWith('+92')) {
      value = '+92' + value.replace(/^0+/, '');
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneno: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirmPassword
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(formData.phoneno)) {
      toast.error("Phone number must be in the format +92xxxxxxxxxx with exactly 10 digits.");
      return;
    }

    setLoading(true); // Start loading

    try {
      const uploadedImageUrl = await uploadImage(formData.base64);

      const formDataToSend = {
        ...formData,
        imageUrl: uploadedImageUrl,  // This URL will be stored in your database
        base64: '', // No need to send the base64 string
        confirmPassword: '', // Don't send confirmPassword to the server
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('User registered successfully! Please check your email to verify your account.');
        setTimeout(() => {
          router.push('/customer/pages/login');
        }, 3000); // Redirect to login after 3 seconds
      } else {
        toast.error(`Error: ${data.message || 'Failed to register user'}`);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const uploadImage = async (base64) => {
    try {
      const response = await fetch('https://data.tascpa.ca/uploadImage.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await response.json();
      if (response.ok) {
        return result.image_url; // This should be the exact key returned by your upload endpoint
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md mt-4 mb-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <span
            className="absolute right-3 top-10 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <span
            className="absolute right-3 top-10 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneno"
            value={formData.phoneno}
            onChange={handlePhoneChange}
            placeholder="+92xxxxxxxxxx"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md flex justify-center items-center"
          disabled={loading}
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-700">Already have an account?</p>
          <button
            onClick={() => router.push('/customer/pages/login')}
            className="mt-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#ffffff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Register;

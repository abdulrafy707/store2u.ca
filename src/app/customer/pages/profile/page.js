'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from 'react-modal'; 
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneno: '',
    city: '',
    imageUrl: '/eco1.jpg',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phoneno: '',
    city: '',
  });
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 1; 
        const response = await axios.get(`/api/users/${userId}`);
        const data = response.data;
        setUserData({
          name: data.name,
          email: data.email,
          phoneno: data.phoneno,
          city: data.city,
          imageUrl: data.imageUrl || '/eco1.jpg',
        });

        setEditData({
          name: data.name,
          phoneno: data.phoneno,
          city: data.city,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data.');
      }
    };

    fetchUserData();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async () => {
    if (!editData.name || !editData.phoneno || !editData.city) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true); 
      const response = await axios.put('/api/users/update_profile', editData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status) {
        toast.success('Profile updated successfully!');
        closeModal(); 
        setUserData({ ...userData, ...editData }); 
      } else {
        toast.error(`Failed to update profile: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      toast.error('Error updating profile.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row items-center justify-between min-h-screen">
      <ToastContainer />
      
      {/* Left side: Image */}
      <div className="w-full md:w-1/2 h-screen flex justify-center items-center">
        <Image
          src={userData.imageUrl}
          alt="Profile Image"
          width={600} // Adjust the width of the image
          height={800} // Increase the height of the image
          className="object-cover w-full h-full shadow-lg"
        />
      </div>

      {/* Right side: Profile Information */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">Name:</h4>
            <p className="text-gray-600">{userData.name || 'Loading...'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Email:</h4>
            <p className="text-gray-600">{userData.email || 'Loading...'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Phone Number:</h4>
            <p className="text-gray-600">{userData.phoneno || 'Loading...'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">City:</h4>
            <p className="text-gray-600">{userData.city || 'Loading...'}</p>
          </div>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={openModal}
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Modal for updating profile */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Update Profile Modal"
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneno"
              value={editData.phoneno}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={editData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;

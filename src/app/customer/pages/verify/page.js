'use client';
// src/app/customer/pages/verify/page.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isRequestSent = false;

    async function verifyEmail() {
      if (isRequestSent) return; // Prevents multiple requests
      isRequestSent = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          // Show toast only on successful verification
          toast.success(data.message || 'Email verified successfully!');
          setTimeout(() => {
            router.push('/customer/pages/login');
          }, 3000); // Redirect to login after 3 seconds
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setLoading(false);
      }
    }

    verifyEmail();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {loading && (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

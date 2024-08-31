'use client';

import React, { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import Header from './components/Header';
import BrowseCategories from './components/BrowseCategories';
import Footer from './components/Footer';
import '../globals.css'; // Assuming you have global styles
import WhatsAppButton from './components/whatsappbutton';

const CustomerLayout = ({ children }) => {
  // State to ensure consistent rendering between server and client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that the component has been mounted
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store2U</title>
        <meta name="description" content="Generated by create next app" />
      </head>
      <body>
        <div className="min-h-screen bg-white flex flex-col">
          <TopBar />
          <Header />
          <main className="flex-grow">
            {isClient && <WhatsAppButton />}
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default CustomerLayout;

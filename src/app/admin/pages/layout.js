'use client';

import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

 // assuming you have admin-specific styles

const AdminLayout = ({ children, setActiveComponent  }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin - Store2U</title>
        <meta name="description" content="Admin panel for Store2U" />
      </head>
      <body>
      <div className="flex flex-row">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>

      </body>
    </html>
  );
};

export default AdminLayout;

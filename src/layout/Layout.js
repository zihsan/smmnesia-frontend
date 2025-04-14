import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';


const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="container mx-auto px-5">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
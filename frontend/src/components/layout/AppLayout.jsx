import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Don't show navbar and footer on login page
  const isLoginPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {!isLoginPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default AppLayout;

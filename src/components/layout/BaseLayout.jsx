import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export const BaseLayout = ({ children }) => {
  return (
    <div className="app-layout" id="top">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;

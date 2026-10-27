import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundElements from './BackgroundElements';

export const BaseLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Observe all upcoming sections and elements marked with .reveal-on-scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    // Initial query and delayed re-query for dynamic route content
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    const timer = setTimeout(() => {
      const refreshed = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      refreshed.forEach((el) => observer.observe(el));
    }, 200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="app-layout" id="top">
      <BackgroundElements />
      <Navbar />
      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;


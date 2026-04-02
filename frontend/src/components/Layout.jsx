import React from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].some(path => location.pathname === path);

  return (
    <div className="flex flex-col min-h-screen selection:bg-indigo-500/30">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'glass !bg-slate-900 !text-white !border-white/10 !rounded-2xl',
          duration: 3000,
        }}
      />
      <Header />
      <main className="flex-grow relative z-10 pt-20">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BackToTop />}
    </div>
  );
};

export default Layout;

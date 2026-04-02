import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Bulletproof SVG Icons for Header
const LinkIcon = () => <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ZapIcon = () => <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Workflow', path: '/#how-it-works' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Analytics', path: '/analytics' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className={`relative glass-card px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-indigo-500/10 border-white/10' : 'border-white/5'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <LinkIcon />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Link<span className="text-indigo-400">Magic</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-tight"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-white/10 mx-2" />
            {user ? (
              <button 
                onClick={logout}
                className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-premium px-5 py-2.5 text-xs uppercase tracking-[0.1em] flex items-center"
                >
                  <ZapIcon />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass-card p-6 space-y-6 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-lg font-bold text-slate-300 hover:text-indigo-400"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/5 space-y-4">
                {user ? (
                  <button 
                    onClick={logout}
                    className="w-full text-left font-bold text-red-500"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="block font-bold text-slate-300">Sign In</Link>
                    <Link 
                      to="/register" 
                      className="btn-premium w-full flex justify-center py-4"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // Scroll to top or to hash on initial load/navigation
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  useEffect(() => {
    // Intercept clicks on links that point to a hash on the current page
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.hash && link.pathname === window.location.pathname) {
        const id = link.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL without page reload if needed
          window.history.pushState(null, '', target.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return null;
};

export default ScrollToHash;

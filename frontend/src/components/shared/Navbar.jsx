import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-white/80 backdrop-blur-sm shadow-md py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-full">
                <img 
                  src="/img/sankalps.png" 
                  alt="संकल्प Logo" 
                  className="h-[60px] w-auto mr-3 transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
              <span className="text-3xl font-bold text-orange-600 font-noto relative group-hover:text-orange-700 transition-colors duration-300">
                संकल्प
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Profile', path: '/profile' },
                { name: 'Orders', path: '/orders' },
                { name: 'Wishlist', path: '/wishlist' }
              ].map((item) => (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={`relative px-4 py-2 rounded-md font-medium overflow-hidden group ${
                    isActive(item.path) 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600'
                  }`}
                >
                  <span className="relative z-10 transition-colors duration-300">{item.name}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0 bg-orange-100 group-hover:h-full transition-all duration-300 -z-0 ${
                    isActive(item.path) ? 'h-full' : ''
                  }`}></span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              <Link 
                to="/cart" 
                className={`relative p-2 rounded-md font-medium transition-all duration-300 ${
                  isActive('/cart') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-800 hover:text-orange-600'
                }`}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5h13M17 19a2 2 0 100 4 2 2 0 000-4zM9 19a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </Link>

              {loading && !isAuthPage ? (
                // Show loading state while checking authentication (only on non-auth pages)
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated && user ? (
                // Show user info when logged in
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <div className="relative group">
                    <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center cursor-pointer">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Show login/signup when not logged in
                <>
                  <Link 
                    to="/login" 
                    className={`px-4 py-2 rounded-md font-medium border transition-all duration-300 ${
                      isActive('/login') 
                        ? 'text-orange-600 border-orange-600 bg-orange-50' 
                        : 'text-orange-600 border-transparent hover:border-orange-600 hover:text-orange-800'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`px-5 py-2 rounded-md font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive('/signup') 
                        ? 'bg-orange-700 text-white' 
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-sm`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'Cart', path: '/cart' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' },
            { name: 'Profile', path: '/profile' },
            { name: 'Orders', path: '/orders' },
            { name: 'Wishlist', path: '/wishlist' }
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                isActive(item.path) 
                  ? 'text-orange-600 bg-orange-50' 
                  : 'text-gray-800 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex flex-col px-5 space-y-2">
            {loading && !isAuthPage ? (
              // Show loading state in mobile menu
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading...</span>
              </div>
            ) : isAuthenticated && user ? (
              // Show user info in mobile menu when logged in
              <>
                <div className="px-3 py-2">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                </div>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive('/profile') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive('/orders') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-800 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-800 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show login/signup in mobile menu when not logged in
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                    isActive('/login') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`block px-4 py-2 rounded-md font-medium text-center shadow-sm transition-all duration-200 ${
                    isActive('/signup') 
                      ? 'bg-orange-700 text-white' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
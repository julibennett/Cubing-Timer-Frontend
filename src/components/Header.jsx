import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  console.log('Retrieved username:', username);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/logout');
  };

  return (
    <header className="bg-black p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50">
      {username ? (
        <>
          <nav className="flex flex-1 space-x-4 justify-end order-2 sm:order-1 mt-2 sm:mt-0">
            <span className="text-white wheaton">Welcome, {username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <img src="/icons/log-out.png" alt="Logout" className="w-4 h-4" />
            </button>
          </nav>
          <Link 
            to="/" 
            className="flex-1 text-white font-bold headfont text-center text-4xl sm:text-6xl order-1 sm:order-2 mt-2 sm:mt-0"
          >
            R U R' U'
          </Link>
          <nav className="flex flex-1 space-x-4 justify-start order-3 mt-2 sm:mt-0">
            <Link to="/chart" className="text-white hover:text-gray-300 wheaton">
              Charts
            </Link>
            <Link to="/search-users" className="text-white hover:text-gray-300 wheaton">
              Search Users
            </Link>
          </nav>
        </>
      ) : (
        <>
          <nav className="flex flex-1 space-x-4 justify-end order-2 sm:order-1 mt-2 sm:mt-0">
            <Link to="/login" className="text-white hover:text-gray-300 wheaton">
              Login
            </Link>
          </nav>
          <Link 
            to="/" 
            className="flex-1 text-white font-bold headfont text-center text-4xl sm:text-6xl order-1 sm:order-2 mt-2 sm:mt-0"
          >
            R U R' U'
          </Link>
          <nav className="flex flex-1 space-x-4 justify-start order-3 mt-2 sm:mt-0">
            <Link to="/register" className="text-white hover:text-gray-300 wheaton">
              Register
            </Link>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;

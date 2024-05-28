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
    <header className="bg-black p-4 flex justify-between items-center sticky top-0 z-50">
      <nav className="flex flex-1 space-x-4 justify-end">
        {username ? (
          <>
            <span className="text-white wheaton">Welcome, {username}</span>
            <Link to="/chart" className="text-white hover:text-gray-300 wheaton">
              Charts
            </Link>
            <Link to="/search-users" className="text-white hover:text-gray-300 wheaton">
              Search Users
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <img src="/icons/log-out.png" alt="Logout" className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-gray-300 wheaton">
              Login
            </Link>
          </>
        )}
      </nav>
      <Link to="/" className="flex-1 text-white text-6xl font-bold headfont text-center">
        R U R' U'
      </Link>
      <nav className="flex flex-1 space-x-4 justify-start">
        {!username && (
          <Link to="/register" className="text-white hover:text-gray-300 wheaton">
            Register
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;

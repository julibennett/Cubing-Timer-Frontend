import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/logout');
  };

  return (
    <header className="bg-black p-4 flex justify-between items-center sticky top-0 z-50">
      <nav className="flex flex-1 space-x-4 justify-end">
        <Link to="/profile" className="text-white hover:text-gray-300 wheaton">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          <img src="/log-out.png" alt="Logout" className="w-4 h-4" />
        </button>
      </nav>
      <Link to="/" className="flex-1 text-white text-6xl font-bold headfont text-center">
        R U R' U'
      </Link>
      <nav className="flex flex-1 space-x-4 justify-start">
        <Link to="/chart" className="text-white hover:text-gray-300 wheaton">
          Charts
        </Link>
        <Link to="/add-friends" className="text-white hover:text-gray-300 wheaton">
          Add Friends
        </Link>
      </nav>
    </header>
  );
};

export default Header;
